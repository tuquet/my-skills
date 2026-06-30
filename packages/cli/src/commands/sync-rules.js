// @ts-check
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Sync .agents/AGENTS.md rules to other IDE agent rules configurations
 */
export async function syncRules(silent = false) {
  const spinner = silent ? null : ora().start('Syncing rules...');

  try {
    const rootDir = process.cwd();
    const sourcePath = resolve(rootDir, '.agents/AGENTS.md');

    if (!existsSync(sourcePath)) {
      if (spinner) {
        spinner.fail(
          chalk.red('Source rule file .agents/AGENTS.md not found.\n') +
          chalk.dim('  Please run "npx skills install-rule <rule>" first to initialize.')
        );
      }
      process.exit(1);
    }

    const ruleContent = readFileSync(sourcePath, 'utf-8');

    // Define target paths
    const syncTargets = [
      { name: 'Cursor (.cursorrules)', path: resolve(rootDir, '.cursorrules') },
      { name: 'Windsurf (.windsurfrules)', path: resolve(rootDir, '.windsurfrules') },
      { name: 'Roo Code / Cline (.clinerules)', path: resolve(rootDir, '.clinerules') },
      {
        name: 'GitHub Copilot (.github/copilot-instructions.md)',
        path: resolve(rootDir, '.github/copilot-instructions.md'),
      },
    ];

    const syncedFiles = [];

    for (const target of syncTargets) {
      const targetDir = dirname(target.path);

      // Create folder if needed (e.g. .github)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      // Write content
      writeFileSync(target.path, ruleContent, 'utf-8');
      syncedFiles.push(target.name);
    }

    if (spinner) {
      spinner.succeed(chalk.green('✓ Rules synchronized successfully!'));
      console.log(chalk.dim('  Source: .agents/AGENTS.md'));
      console.log(chalk.dim('  Targets updated:'));
      for (const file of syncedFiles) {
        console.log(chalk.dim(`    - ${file}`));
      }
    } else if (!silent) {
      console.log(chalk.green('✓ Rules synchronized to other IDE configurations successfully.'));
    }

  } catch (err) {
    if (spinner) {
      spinner.fail(chalk.red(`Synchronization failed: ${err.message}`));
    }
    process.exit(1);
  }
}
