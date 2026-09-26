# Yandex Games Dev Skill

Практический скилл для интеграции SDK, диагностики и подготовки игр к публикации в Яндекс Играх. Основной источник — [Nioris/yandex-games-debug-checker](https://github.com/Nioris/yandex-games-debug-checker): в репозиторий включена полная неизменённая версия **v1.1.0, 93 проверки**, с MIT-лицензией, исходниками, тестами и примером before/after.

Скилл сохраняет текущий движок проекта: JavaScript, Three.js/R3F и существующие Unity/Godot Web-сборки. Чекер неофициальный: его PASS не гарантирует модерацию, а актуальные официальные правила имеют приоритет.

## Что добавлено

- [SKILL.md](SKILL.md): последовательность интеграции, аудита, исправления и проверки релиза.
- [Запуск чекера](references/debug-checker.md): подключение, API, панель, отчёты, таймлайн, локализация и ограничения реализации.
- [Все 93 проверки](references/check-catalog.md): полный каталог с переходами к [инструкциям исправления](references/check-remediation.md).
- [Ручная проверка](references/manual-verification.md): реклама, сохранения, покупки, язык, устройства, чистая сборка и шаблон отчёта.
- [SDK](references/yandex-sdk.md), руководства по движкам и [публикация](references/publishing.md).
- [Проверка релизного архива](scripts/check_release.py): ZIP/папка, размер, пути, имена, CRC, забытый checker/mock SDK; JSON и код возврата для CI.
- [SDK-обёртка](assets/ya-sdk.js): единая инициализация, повтор после ошибки, защита ready и награды от дублей, полные callback-параметры рекламы. Пауза, звук и сохранение наград остаются ответственностью игры.
- [Происхождение и карта всех возможностей](references/upstream.md), закреплённый commit и SHA-256 каждого upstream-файла.

Исправлены прежние неточности: запрет любых локальных сохранений, преждевременный Game Ready в примерах движков, обязательность опциональных API и смешение требований с рекомендациями. Особенности regex-проверок описаны явно, включая возможные ложные PASS и N/A.

## Использование

Скопируйте **всю папку**, включая `references`, `assets`, `scripts` и `vendor`, в каталог скиллов вашего агента под именем `yandex-games-dev`. Для Codex это обычно `~/.codex/skills/yandex-games-dev/`, для Claude Code — `~/.claude/skills/yandex-games-dev/`. Для других агентов укажите `SKILL.md` как точку входа. Копия скилла вне этого репозитория автоматически не обновляется.

Примеры запросов:

- «Подключи SDK Яндекс Игр к существующей Three.js игре».
- «Проверь сборку перед модерацией, прогони чекер и составь отчёт с доказательствами».
- «Разбери отказ по 1.19: Game Ready срабатывает слишком рано».
- «Проверь награды, паузу и восстановление покупки после перезагрузки».

Диагностическая сборка: подключите `/sdk.js` → `debugcheck.js` → игровой код; откройте `YGDebugChecker.open()` в игровом iframe. Подробности и ограничения — в [runbook](references/debug-checker.md). В production не включайте checker и mock SDK.

## Проверка самого скилла

Нужны Node.js 22+, Python 3; для browser-тестов — Chrome/Chromium. Runtime-зависимостей/npm-install нет.

```sh
npm run audit               # все проверки, включая Chrome и сборку демо
npm test                    # без браузера
npm run test:browser
npm run test:demo
python3 scripts/check_release.py /absolute/path/to/game.zip
```

GitHub Actions запускает полный аудит при push и pull request. Демо собирается во временной папке для проверки; автоматическая публикация Pages не включена.

Если браузер не найден, задайте `CHROME_BIN`. Отсутствие браузера считается ошибкой, а не успешным пропуском. Тесты чекера используют mock SDK и не доказывают работу реальной рекламы или покупок.

## Лицензия

Собственные материалы — [MIT](LICENSE). Upstream — [MIT, © 2026 3/9 Games](vendor/yandex-games-debug-checker/LICENSE); копия сохранена с атрибуцией. Версия закреплена в [lock-файле](vendor/checker-lock.json), обновление описано в [provenance](references/upstream.md).

## Support

If this project is useful to you, you can support its development with a crypto tip — thank you!

**USDT — Ethereum (ERC-20):**

`0xad39bdf2df0b8dd6991150fcea0a156150ed19b8`

[View / verify on Etherscan](https://etherscan.io/address/0xad39bdf2df0b8dd6991150fcea0a156150ed19b8)

> Send only on the **Ethereum (ERC-20)** network.
