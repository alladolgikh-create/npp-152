# Реестр видео SASHA BELAIR — тулкит для сбора

Инструмент собирает единый реестр всех роликов с аккаунтов SASHA BELAIR
(TikTok + Instagram): ссылка, метаданные, превью. Колонки под формат
съёмки (`format_guess`, `format_confirmed`) остаются **пустыми** — их
заполняет человек по превью/скринам (формат нельзя надёжно определить
по подписи или обложке).

> ⚠️ **Запускать локально, не в облачной сессии Claude Code.**
> Сбор требует активного **VPN** (TikTok/Instagram геоблокируют и банят
> ботов) и **cookies залогиненного Instagram**. В sandbox-окружении
> Claude Code на web нет ни VPN, ни доступа к соцсетям (прокси отдаёт
> 403, TLS перехватывается) — поэтому здесь подготовлен готовый скрипт,
> а сам сбор запускается на твоей машине.

## Что на выходе

После запуска в папке `output/`:

1. `master_reestr.csv` — все ролики со ссылками, метаданными и пустыми
   колонками под формат. UTF-8 с BOM → открывается в Google Sheets и
   Excel без кракозябр.
2. `thumbnails/` — превью каждого ролика, имя `{account}_{id}.jpg`
   (Вариант A из ТЗ).
3. `README.md` — отчёт: по каждому аккаунту число роликов, дата сбора,
   какие поля удалось достать.
4. `raw/` — сырые выгрузки yt-dlp / gallery-dl (на случай переразбора).

Колонки CSV: `platform, account, url, id, date, caption, views, likes,
duration_sec, thumbnail_url, format_guess, format_confirmed`.

## Предусловия

- Python 3.8+ (скрипт — только стандартная библиотека).
- `ffmpeg` — нужен только для Варианта B (раскадровка, опционально).
- **Активный VPN.**
- Инструменты CLI, обновить до последней версии:
  ```bash
  pip install -U yt-dlp gallery-dl
  ```
- Для Instagram — `cookies.txt` залогиненного аккаунта. Экспортировать
  расширением браузера (напр. «Get cookies.txt LOCALLY»), положить рядом.

## Запуск

```bash
# всё сразу (TikTok + Instagram), с превью
python3 collect.py --cookies cookies.txt

# быстрый тест: по 5 роликов с каждого TikTok-аккаунта
python3 collect.py --only tiktok --limit 5

# только Instagram
python3 collect.py --only instagram --cookies cookies.txt

# без скачивания превью (только CSV)
python3 collect.py --cookies cookies.txt --no-thumbnails
```

Флаги:

| Флаг | Назначение |
|---|---|
| `--cookies PATH` | путь к `cookies.txt` (обязателен для Instagram) |
| `--only tiktok\|instagram` | собрать только одну платформу |
| `--limit N` | не больше N роликов на аккаунт (для теста) |
| `--no-thumbnails` | не качать превью |
| `--out-dir DIR` | папка результатов (по умолчанию `./output`) |

Аккаунты зашиты в `collect.py` (список `ACCOUNTS`), порядок — по
приоритету из ТЗ: сначала `@sasha___belair`, затем `@ab_usa`,
`@sashabelair`, `@sashabelair_`.

## Вариант B — раскадровка (опционально, по необходимости)

Если по обложке формат не читается, скачать видео и нарезать кадры.
Запускать точечно, он тяжёлый по объёму:

```bash
# скачать видео конкретного ролика
yt-dlp -o "video.%(ext)s" "https://www.tiktok.com/@sasha___belair/video/<ID>"

# кадр каждые 3 секунды
mkdir -p frames
ffmpeg -i video.mp4 -vf "fps=1/3" "frames/%03d.jpg"
```

## Риски / заметки

- **Instagram без cookies** не отдаст контент (логин-вол); cookies
  протухают — при ошибке авторизации обновить файл.
- При массовых запросах — rate limits и временные баны; в командах
  стоят задержки (`--sleep-interval` / `--sleep`), не убирать.
- Версии `yt-dlp`/`gallery-dl` устаревают быстро — обновлять перед
  запуском, флаги сверять с `yt-dlp --help` / `gallery-dl --help`.
- Это собственные аккаунты заказчика, сбор для внутренней аналитики.
- Формат **не** определяется автоматически — колонки `format_guess` и
  `format_confirmed` остаются пустыми.
