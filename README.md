# OmniAgent Skills CLI

Install OmniAgent skills with a single command.

```
npx @tuquet/skills-cli install automa
```

## Commands

| Command                              | Description                               |
| ------------------------------------ | ----------------------------------------- |
| `npx @tuquet/skills-cli install <skill>` | Download a skill to `.agents/skills/` |
| `npx @tuquet/skills-cli list`           | List all available skills             |
| `npx @tuquet/skills-cli info <skill>`   | Show details about a skill            |
| `npx @tuquet/skills-cli --help`         | Show full help                        |

## Quick Start

```bash
# Install a skill
npx @tuquet/skills-cli install automa

# List available skills
npx @tuquet/skills-cli list

# Get info about a skill
npx @tuquet/skills-cli info automa
```

## How it works

The CLI copies skill `.md` files from the registry into your project's `.agents/skills/<skill-name>/` directory.

## Development

```bash
# Install dependencies
npm install

# Run CLI locally
npm run cli install automa
# or
node packages/cli/bin/index.js install automa
```

## Publishing

```bash
# Publish registry package first, then CLI
npm run publish:all
```