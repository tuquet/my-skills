#!/usr/bin/env node
import { program } from 'commander';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

program
  .name('skills')
  .description('Install OpenCode AI skills with one command')
  .version(pkg.version);

program
  .command('install <skill>')
  .description('Download a skill to .agents/skills/ in the current directory')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (skill, opts) => {
    const { installSkill } = await import('../src/commands/install.js');
    await installSkill(skill, opts.force);
  });

program
  .command('install-rule <rule>')
  .description('Download and append a rule template to .agents/AGENTS.md')
  .option('-f, --force', 'Overwrite the existing AGENTS.md file completely')
  .action(async (rule, opts) => {
    const { installRule } = await import('../src/commands/install-rule.js');
    await installRule(rule, opts.force);
  });

program
  .command('sync-rules')
  .description('Synchronize .agents/AGENTS.md to other IDE rules files (.cursorrules, .windsurfrules, etc.)')
  .action(async () => {
    const { syncRules } = await import('../src/commands/sync-rules.js');
    await syncRules();
  });

program
  .command('list')
  .description('List all available skills')
  .action(async () => {
    const { listSkills } = await import('../src/commands/list.js');
    await listSkills();
  });

program
  .command('info <skill>')
  .description('Show detailed information about a skill')
  .action(async (skill) => {
    const { showInfo } = await import('../src/commands/info.js');
    await showInfo(skill);
  });

program.parse(process.argv);
