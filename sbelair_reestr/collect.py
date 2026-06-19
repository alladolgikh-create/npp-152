#!/usr/bin/env python3
"""
SASHA BELAIR — сбор реестра видео.

Оркестратор: для каждого аккаунта вызывает нужный внешний инструмент
(yt-dlp для TikTok, gallery-dl для Instagram), парсит метаданные,
складывает всё в единый master_reestr.csv, качает превью и пишет отчёт.

Скрипт НЕ классифицирует формат — колонки format_guess / format_confirmed
остаются пустыми (их заполняет человек), как и требует ТЗ.

Запускать ЛОКАЛЬНО на машине с активным VPN (TikTok/Instagram).
Для Instagram нужен файл cookies.txt залогиненного аккаунта.

Пример:
    python3 collect.py --cookies cookies.txt
    python3 collect.py --only tiktok --limit 5        # быстрый тест
    python3 collect.py --no-thumbnails

Зависимости (CLI): yt-dlp, gallery-dl. Python: только стандартная библиотека.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

# --- список аккаунтов из ТЗ (по приоритету) -------------------------------

ACCOUNTS = [
    {
        "platform": "tiktok",
        "account": "sasha___belair",
        "url": "https://www.tiktok.com/@sasha___belair",
        "priority": 1,
        "note": "основной, бьюти (belairbeauty)",
    },
    {
        "platform": "tiktok",
        "account": "ab_usa",
        "url": "https://www.tiktok.com/@ab_usa",
        "priority": 2,
        "note": "музыка / lifestyle (Singer)",
    },
    {
        "platform": "instagram",
        "account": "sashabelair",
        "url": "https://www.instagram.com/sashabelair/",
        "priority": 2,
        "note": "2M, ~90 постов",
    },
    {
        "platform": "instagram",
        "account": "sashabelair_",
        "url": "https://www.instagram.com/sashabelair_/",
        "priority": 3,
        "note": "6M, artist",
    },
]

# Порядок колонок в итоговом CSV (строго по ТЗ).
FIELDS = [
    "platform",
    "account",
    "url",
    "id",
    "date",
    "caption",
    "views",
    "likes",
    "duration_sec",
    "thumbnail_url",
    "format_guess",      # пусто — заполнит человек
    "format_confirmed",  # пусто — заполнит человек
]


# --- утилиты ---------------------------------------------------------------

def log(msg: str) -> None:
    print(f"[reestr] {msg}", flush=True)


def first(d: dict, *keys, default=""):
    """Вернуть первое непустое значение по списку возможных ключей."""
    for k in keys:
        v = d.get(k)
        if v not in (None, "", []):
            return v
    return default


def to_iso_date(value) -> str:
    """Привести разные форматы даты к YYYY-MM-DD."""
    if value in (None, ""):
        return ""
    # unix timestamp (yt-dlp `timestamp`)
    if isinstance(value, (int, float)):
        try:
            return dt.datetime.utcfromtimestamp(value).strftime("%Y-%m-%d")
        except (OverflowError, OSError, ValueError):
            return ""
    s = str(value)
    # yt-dlp `upload_date` = YYYYMMDD
    if s.isdigit() and len(s) == 8:
        return f"{s[0:4]}-{s[4:6]}-{s[6:8]}"
    # gallery-dl `date` = "YYYY-MM-DD HH:MM:SS"
    return s[:10]


def require_tool(name: str) -> str:
    path = shutil.which(name)
    if not path:
        log(f"ОШИБКА: не найден '{name}'. Установи: pip install -U yt-dlp gallery-dl")
        sys.exit(2)
    return path


# --- TikTok через yt-dlp ---------------------------------------------------

def collect_tiktok(acc: dict, raw_dir: Path, limit: int | None) -> list[dict]:
    require_tool("yt-dlp")
    raw_path = raw_dir / f"{acc['account']}_tt.jsonl"
    cmd = [
        "yt-dlp", acc["url"],
        "--skip-download",
        "--dump-json",
        "--ignore-errors",
        "--no-warnings",
        "--sleep-interval", "2",
        "--max-sleep-interval", "5",
    ]
    if limit:
        cmd += ["--playlist-items", f"1:{limit}"]

    log(f"TikTok @{acc['account']}: запуск yt-dlp …")
    with raw_path.open("w", encoding="utf-8") as fh:
        proc = subprocess.run(cmd, stdout=fh, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        log(f"  yt-dlp завершился с кодом {proc.returncode} (часть данных могла собраться):")
        for line in (proc.stderr or "").strip().splitlines()[-5:]:
            log(f"    {line}")

    rows: list[dict] = []
    for line in raw_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            v = json.loads(line)
        except json.JSONDecodeError:
            continue
        if v.get("_type") == "playlist" or not v.get("id"):
            continue
        rows.append({
            "platform": "tiktok",
            "account": acc["account"],
            "url": first(v, "webpage_url", "url", "original_url"),
            "id": v.get("id", ""),
            "date": to_iso_date(first(v, "timestamp", "upload_date")),
            "caption": first(v, "description", "title"),
            "views": first(v, "view_count"),
            "likes": first(v, "like_count"),
            "duration_sec": first(v, "duration"),
            "thumbnail_url": first(v, "thumbnail"),
            "format_guess": "",
            "format_confirmed": "",
        })
    log(f"  собрано роликов: {len(rows)}")
    return rows


# --- Instagram через gallery-dl -------------------------------------------

def collect_instagram(acc: dict, raw_dir: Path, cookies: str | None,
                      limit: int | None) -> list[dict]:
    require_tool("gallery-dl")
    if not cookies or not Path(cookies).exists():
        log(f"  ВНИМАНИЕ: cookies не заданы/не найдены ({cookies!r}). "
            f"Instagram отдаст логин-вол. Пропускаю @{acc['account']}.")
        return []

    raw_path = raw_dir / f"{acc['account']}_ig.json"
    cmd = [
        "gallery-dl",
        "--cookies", cookies,
        "--sleep", "3",
        "-j",  # печать метаданных в JSON, без скачивания файлов
        acc["url"],
    ]
    if limit:
        cmd += ["--range", f"1-{limit}"]

    log(f"Instagram @{acc['account']}: запуск gallery-dl …")
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                          text=True)
    raw_path.write_text(proc.stdout or "", encoding="utf-8")
    if proc.returncode != 0:
        log(f"  gallery-dl завершился с кодом {proc.returncode}:")
        for line in (proc.stderr or "").strip().splitlines()[-5:]:
            log(f"    {line}")

    try:
        data = json.loads(proc.stdout or "[]")
    except json.JSONDecodeError:
        log("  не удалось распарсить вывод gallery-dl (см. raw-файл).")
        return []

    # gallery-dl -j печатает список сообщений вида [type, url, metadata].
    # Группируем по посту (shortcode), чтобы карусели не плодили дубли.
    posts: dict[str, dict] = {}
    for item in data:
        if not (isinstance(item, list) and len(item) >= 3 and isinstance(item[2], dict)):
            continue
        media_url, meta = item[1], item[2]
        shortcode = str(first(meta, "post_shortcode", "shortcode", "code",
                              default=first(meta, "post_id", "id")))
        if not shortcode:
            continue
        if shortcode in posts:
            continue  # первый медиа-элемент поста уже взяли
        posts[shortcode] = {
            "platform": "instagram",
            "account": acc["account"],
            "url": first(meta, "post_url") or f"https://www.instagram.com/p/{shortcode}/",
            "id": shortcode,
            "date": to_iso_date(first(meta, "date", "post_date", "timestamp")),
            "caption": first(meta, "description", "caption", "post_caption"),
            "views": first(meta, "video_view_count", "view_count", "views", "play_count"),
            "likes": first(meta, "likes", "like_count", "edge_liked_by"),
            "duration_sec": first(meta, "video_duration", "duration"),
            "thumbnail_url": first(meta, "display_url", "thumbnail_url", "thumbnail")
                             or (media_url if str(media_url).startswith("http") else ""),
            "format_guess": "",
            "format_confirmed": "",
        }
    rows = list(posts.values())
    log(f"  собрано постов: {len(rows)}")
    return rows


# --- превью (Вариант A из ТЗ) ---------------------------------------------

def download_thumbnails(rows: list[dict], thumbs_dir: Path) -> tuple[int, int]:
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    ok = fail = 0
    headers = {"User-Agent": "Mozilla/5.0 (compatible; reestr/1.0)"}
    for r in rows:
        url = r.get("thumbnail_url")
        if not url or not str(url).startswith("http"):
            continue
        dest = thumbs_dir / f"{r['account']}_{r['id']}.jpg"
        if dest.exists():
            ok += 1
            continue
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                dest.write_bytes(resp.read())
            ok += 1
        except Exception as e:  # noqa: BLE001 — best-effort
            fail += 1
            if fail <= 3:
                log(f"  превью не скачалось ({r['account']}_{r['id']}): {e}")
    log(f"  превью: ок {ok}, ошибок {fail}")
    return ok, fail


# --- запись артефактов -----------------------------------------------------

def write_csv(rows: list[dict], path: Path) -> None:
    # utf-8-sig (BOM) — чтобы Excel открывал кириллицу без кракозябр.
    with path.open("w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        for r in rows:
            writer.writerow({k: ("" if r.get(k) is None else r.get(k, "")) for k in FIELDS})
    log(f"CSV записан: {path} ({len(rows)} строк)")


def write_report(rows: list[dict], per_account: dict, thumb_stats: tuple,
                 path: Path, run_date: str) -> None:
    by_acc: dict[str, int] = {}
    for r in rows:
        by_acc[r["account"]] = by_acc.get(r["account"], 0) + 1

    def filled(field: str, acc: str) -> int:
        return sum(1 for r in rows if r["account"] == acc and r.get(field) not in (None, ""))

    lines = [
        "# Реестр видео SASHA BELAIR — отчёт о сборе",
        "",
        f"- **Дата сбора:** {run_date}",
        f"- **Всего роликов в реестре:** {len(rows)}",
        f"- **Превью скачано:** {thumb_stats[0]} (ошибок: {thumb_stats[1]})",
        "",
        "## По аккаунтам",
        "",
        "| Платформа | Аккаунт | Роликов | Есть views | Есть likes | Есть duration | Есть превью |",
        "|---|---|---|---|---|---|---|",
    ]
    for acc in ACCOUNTS:
        a = acc["account"]
        if a not in by_acc and a not in per_account:
            continue
        n = by_acc.get(a, 0)
        lines.append(
            f"| {acc['platform']} | @{a} | {n} | "
            f"{filled('views', a)} | {filled('likes', a)} | "
            f"{filled('duration_sec', a)} | {filled('thumbnail_url', a)} |"
        )
    lines += [
        "",
        "## Поля",
        "",
        "Заполнены при сборе: `platform`, `account`, `url`, `id`, `date`, `caption` "
        "(где есть), плюс `views`/`likes`/`duration_sec`/`thumbnail_url` — там, где "
        "платформа их отдаёт (см. таблицу выше).",
        "",
        "**Пустые намеренно** (заполняет человек по превью/скринам): "
        "`format_guess`, `format_confirmed`.",
        "",
        "## Замечания по сбору",
        "",
    ]
    for acc in ACCOUNTS:
        a = acc["account"]
        status = per_account.get(a, "не запускался")
        lines.append(f"- **@{a}** ({acc['platform']}): {status}")
    lines += [
        "",
        "## Следующий шаг (вне Claude Code)",
        "",
        "`master_reestr.csv` + `thumbnails/` передаются дальше: ролики "
        "привязываются к форматам съёмки, номера проставляются в "
        "`format_confirmed`. Где обложки мало — делается раскадровка "
        "(см. README токлита, Вариант B).",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")
    log(f"Отчёт записан: {path}")


# --- main ------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description="Сбор реестра видео SASHA BELAIR")
    ap.add_argument("--out-dir", default=str(Path(__file__).parent / "output"),
                    help="папка для результатов (по умолчанию ./output)")
    ap.add_argument("--cookies", default=None,
                    help="путь к cookies.txt для Instagram")
    ap.add_argument("--only", choices=["tiktok", "instagram"], default=None,
                    help="собрать только одну платформу")
    ap.add_argument("--limit", type=int, default=None,
                    help="ограничить число роликов на аккаунт (для теста)")
    ap.add_argument("--no-thumbnails", action="store_true",
                    help="не скачивать превью (только CSV)")
    args = ap.parse_args()

    out_dir = Path(args.out_dir)
    raw_dir = out_dir / "raw"
    thumbs_dir = out_dir / "thumbnails"
    out_dir.mkdir(parents=True, exist_ok=True)
    raw_dir.mkdir(parents=True, exist_ok=True)
    run_date = dt.date.today().isoformat()

    all_rows: list[dict] = []
    per_account: dict[str, str] = {}

    for acc in sorted(ACCOUNTS, key=lambda a: a["priority"]):
        if args.only and acc["platform"] != args.only:
            continue
        try:
            if acc["platform"] == "tiktok":
                rows = collect_tiktok(acc, raw_dir, args.limit)
            else:
                rows = collect_instagram(acc, raw_dir, args.cookies, args.limit)
            all_rows.extend(rows)
            per_account[acc["account"]] = f"собрано {len(rows)} роликов"
        except SystemExit:
            raise
        except Exception as e:  # noqa: BLE001
            per_account[acc["account"]] = f"ошибка: {e}"
            log(f"  ошибка на @{acc['account']}: {e}")

    csv_path = out_dir / "master_reestr.csv"
    write_csv(all_rows, csv_path)

    thumb_stats = (0, 0)
    if not args.no_thumbnails:
        log("Качаю превью (Вариант A) …")
        thumb_stats = download_thumbnails(all_rows, thumbs_dir)

    write_report(all_rows, per_account, thumb_stats, out_dir / "README.md", run_date)

    log("Готово.")
    log(f"  → {csv_path}")
    log(f"  → {thumbs_dir}/")
    log(f"  → {out_dir / 'README.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
