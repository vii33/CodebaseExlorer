# MiniClaw Documentation

This file contains generated documentation for [`vii33/MiniClaw`](https://github.com/vii33/MiniClaw), based on the current `main` branch structure and source files.

## What MiniClaw is

MiniClaw is a lightweight, Markdown-first AI assistant built around [Opencode](https://opencode.ai). Instead of using a database-heavy architecture, it keeps most of its persistent state in plain files:

- prompt and behavior files in the repo root
- durable memory in `MEMORY.md`
- raw daily session exports in `memory/history/`
- weekly summaries in `memory/knowledge/`
- cron task definitions in `crons/tasks.yaml`
- runtime scheduler state in `.miniclaw/task-state.json`

The project goal is to keep the assistant simple, inspectable, and easy to evolve with normal file-based workflows.

## Core architecture

MiniClaw is organized around three main concerns:

1. **Assistant identity and behavior**
   - `IDENTITY.md`
   - `AGENTS.md`
   - `SOUL.md`
   - `USER.md`
   - `TOOLS.md`

2. **Memory management**
   - `MEMORY.md` for always-loaded distilled memory
   - `memory/history/YYYY-MM-DD.md` for raw daily history
   - `memory/knowledge/weekly-YYYY-Www.md` for higher-level summaries
   - `memory/facts.md` as a scratch pad

3. **Automation**
   - `scripts/export-sessions.sh` exports sessions from Opencode
   - `scripts/task-loop.js` polls for due tasks and executes them
   - `crons/tasks.yaml` is the source of truth for scheduled work
   - `.miniclaw/task-state.json` stores `last_run` and `last_error`

## Diagrams

- [Architecture overview](diagrams/miniclaw-architecture.mmd)
- [Scheduler flow](diagrams/miniclaw-scheduler-flow.mmd)

## How the system works

### 1. Session export

The export script:

- checks the Opencode health endpoint first
- fetches sessions for a target day
- writes a Markdown history file to `memory/history/YYYY-MM-DD.md`
- appends a `## Summary` placeholder for later analysis

Actual API usage in the script is:

- `GET /global/health`
- `GET /experimental/session`
- `GET /session/:id/message`

The script supports:

```bash
./scripts/export-sessions.sh
./scripts/export-sessions.sh --date 2026-03-07
./scripts/export-sessions.sh --host 127.0.0.1 --port 4096
```

### 2. Scheduled task execution

The scheduler is implemented in `scripts/task-loop.js`. It is a polling loop, not a system cron integration.

Its runtime flow is:

1. read `crons/tasks.yaml`
2. parse and validate enabled tasks
3. read `.miniclaw/task-state.json`
4. decide which tasks are due for the current minute
5. skip tasks that already ran in that exact minute slot
6. execute each due task
7. update runtime state on success or failure

Supported task kinds:

- `shell` — runs a restricted local command
- `opencode` — sends an instruction to `opencode run`

Helpful commands:

```bash
node scripts/task-loop.js
node scripts/task-loop.js --once
node scripts/task-loop.js --once --dry-run --at 2026-03-07T23:15:00Z
```

### 3. Memory lifecycle

MiniClaw intentionally separates memory into layers:

| Layer | Storage | Role |
|---|---|---|
| Distilled memory | `MEMORY.md` | Stable preferences, decisions, lessons |
| Raw daily history | `memory/history/YYYY-MM-DD.md` | Full day-level transcript record |
| Weekly knowledge | `memory/knowledge/weekly-YYYY-Www.md` | Cross-day summaries |

This keeps the always-loaded context small while preserving detailed history for later review.

## Repository structure

```text
MiniClaw/
├── AGENTS.md
├── IDENTITY.md
├── MEMORY.md
├── README.md
├── SOUL.md
├── TOOLS.md
├── USER.md
├── crons/
│   └── tasks.yaml
├── docs/
│   └── tasks-memory-architecture.md
├── memory/
│   ├── facts.md
│   ├── history/
│   └── knowledge/
├── scripts/
│   ├── export-sessions.sh
│   └── task-loop.js
└── .miniclaw/
    └── task-state.json
```

## Important files

### `AGENTS.md`

Defines the assistant's operating rules:

- startup loading order
- memory update discipline
- security boundaries
- Opencode integration expectations
- task execution rules

### `crons/tasks.yaml`

Defines scheduled jobs as YAML entries under the top-level `tasks:` list.

Current built-in tasks:

- `daily-export`
- `daily-analysis`
- `weekly-review`

The file also stores prompt text for `opencode` tasks, which means task behavior is partly configuration-driven.

### `scripts/task-loop.js`

This is the active scheduler implementation today. Key behaviors include:

- custom task YAML parsing and validation
- cron matching
- duplicate-run protection per minute slot
- model selection with fallback
- shell command restrictions
- state file updates

Notably, the backlog mentions a future Go rewrite, but the current implementation is JavaScript.

### `docs/tasks-memory-architecture.md`

This is the most complete internal design document in the MiniClaw repo. It explains:

- how tasks are stored
- how runtime state is tracked
- where outputs appear
- why the project uses the Opencode HTTP interface
- how the memory layers are intended to stay clean over time

## Configuration

MiniClaw is configured primarily through environment variables and local files.

Relevant environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `OPENCODE_HOST` | `127.0.0.1` | Opencode host |
| `OPENCODE_PORT` | `4096` | Opencode port |
| `OPENCODE_PASSWORD` | unset | Optional basic-auth password |
| `OPENCODE_USERNAME` | `opencode` | Basic-auth username |
| `OPENCODE_TASK_MODEL` | `zen/minimax2.5-free` | Scheduler model override |
| `TASK_LOOP_POLL_SECONDS` | `60` | Scheduler poll interval |

Secrets are expected in a repo-root `.env` file, with `.env.example` documenting the expected keys.

## Current implementation status

Based on `implementation-backlog.md`, MiniClaw is partially implemented.

Working pieces:

- file-based memory layout
- session export script
- poll-based task scheduler
- configurable model selection

Still listed as incomplete or needing hardening:

- session chat loop
- stronger scheduler locking and tests
- richer run logging and observability
- better handling of large/invalid task outputs
- possible future Go scheduler rewrite
- web UI

## Practical summary

MiniClaw is best understood as a small assistant runtime built from plain files plus a scheduler:

- Markdown files define identity, memory, and user context
- Opencode supplies chat/session infrastructure
- shell and Opencode tasks automate export and summarization
- scheduler state is intentionally lightweight

The design favors transparency and hackability over heavy infrastructure.
