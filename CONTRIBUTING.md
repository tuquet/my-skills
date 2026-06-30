# Contributing

## Adding a new skill

1. Create skill files in `packages/registry/skills/<skill-name>/`:
   - `SKILL.md` — main skill file (must have frontmatter with `name` and `description`)
   - `references/` — optional reference docs

2. Add the skill metadata to `packages/cli/src/registry.js`:
   ```js
   'your-skill': {
     name: 'your-skill',
     description: 'Short description',
     version: '1.0.0',
     category: 'Category name',
     author: 'Author name',
     keywords: ['keyword1', 'keyword2'],
     path: 'your-skill/',
     files: ['SKILL.md'],
   }
   ```

3. Update `install.js` if the skill has custom file structure.

## Testing locally

```bash
npm run cli list
npm run cli info automa
npm run cli install automa
```