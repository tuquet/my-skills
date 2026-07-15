---
name: automa-cli
description: "Guides on how to run, lint, align, push, and pull Automa workflows using the unified automa-cli."
---

# Automa CLI Reference Guide

`automa-cli` is the single orchestration tool for the Automa ecosystem. It is used to execute workflows via Puppeteer, perform static linting, automatically align layouts, and synchronize files between the local vault and the Supabase database.

---

## 1. Subcommands & Usage

### Execute Workflow (`run` or default)
Runs a workflow in a headless or headful Chrome browser using Puppeteer.
```bash
# Run a local workflow file
automa-cli run crm/workflows/login.json --extension=../automa-ex/build

# Run a remote workflow directly from the DB by ID
automa-cli --id OYsxwfjHwwlLjE9U9Gjv3 --extension=../automa-ex/build
```

### Static Linting (`lint`)
Performs schema integrity and variable declaration checks.
```bash
automa-cli lint --project=crm --vault-path=.
```
- **Checks**:
  - Node Schema Integrity: Matches block properties against `automa.schema.json`.
  - Variable Declarations: Ensures any `{{variables.varName}}` or `automaRefData('variables', 'varName')` used in JS/HTML blocks is declared in `trigger.parameters` or the project's global variables list.

### Push to Database (`push`)
Performs pre-checks and seeds local vault files to the database.
```bash
automa-cli push --project=crm --vault-path=.
```
- **Order of Execution**:
  1. **Linter Hook**: Automatically runs the static linter. If linting fails (exits with code 1), the push action is aborted immediately.
  2. **Auto-Aligner Hook**: Automatically runs Dagre layouts to align node positions in the source JSON files.
  3. **Diff Seed**: Pushes only new/modified records to the Database tables (`workflows`, `packages`, `folders`, `variables`, `credentials`, `tables`, `table_rows`, `html_snapshots`).

### Pull from Database (`pull`)
Retrieves database records and updates local JSON files in the vault.
```bash
automa-cli pull --project=crm --vault-path=.
```

### Check Sync Status (`status`)
Compares local vault files against database records.
```bash
automa-cli status --project=crm --vault-path=.
```

---

## 2. Command Options

| Option | Shorthand | Description | Default |
|--------|-----------|-------------|---------|
| `--id` | - | Supabase Workflow ID to fetch and execute | - |
| `--extension` | `-e` | Path to the built Automa chrome extension directory | `../automa-ex/build` |
| `--variables` | `-v` | JSON string of variables to inject at runtime | `{}` |
| `--timeout` | `-t` | Execution timeout in milliseconds | `60000` |
| `--scan-only` | - | Parse and scan workflow dependencies without executing it | `false` |
| `--download` | - | Download and extract the latest extension build zip | - |
| `--clean` | - | Clear downloaded temp zips and extension cache | - |

---

## 3. Configuration & Target DB

The connection settings are loaded dynamically from the target vault directory. `automa-cli` will search for:
1. `<vaultPath>/<projectName>/.vault/settings.json`
2. `<vaultPath>/<projectName>/.vault/settings.local.json` (user-specific, gitignored override)

```json
{
  "supabaseUrl": "http://127.0.0.1:54321",
  "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "enabledTables": ["workflows", "packages", "folders", "variables", "credentials", "tables", "table_rows", "html_snapshots"]
}
```
