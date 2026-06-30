// @ts-check
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import chalk from 'chalk';
import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve path to rule file in the registry package
 */
function getRuleSourcePath(ruleFileName) {
  // Try local registry first (monorepo development)
  const localPath = resolve(__dirname, '../../../registry/rules', ruleFileName);
  if (existsSync(localPath)) return localPath;

  // Fallback: resolve from installed tuquet-skills-registry package
  try {
    const require = createRequire(import.meta.url);
    const regPath = require.resolve('tuquet-skills-registry/rules/' + ruleFileName);
    return regPath;
  } catch {
    return null;
  }
}

/**
 * Install a rule template to the target .agents/AGENTS.md
 */
export async function installRule(ruleName, force = false) {
  const spinner = ora().start();

  try {
    const { getRule } = await import('../registry.js');
    const ruleMeta = getRule(ruleName);

    if (!ruleMeta) {
      spinner.fail(chalk.red(`Rule "${ruleName}" not found in registry.`));
      process.exit(1);
    }

    const sourcePath = getRuleSourcePath(ruleMeta.file);
    if (!sourcePath) {
      spinner.fail(chalk.red(`Cannot locate rule file "${ruleMeta.file}".`));
      process.exit(1);
    }

    const targetDir = resolve(process.cwd(), '.agents');
    const targetPath = join(targetDir, 'AGENTS.md');

    // Create target directory if it doesn't exist
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const ruleContent = readFileSync(sourcePath, 'utf-8');

    // If file doesn't exist, create fresh
    if (!existsSync(targetPath) || force) {
      const template = `---
type: rule
project: ${resolve(process.cwd()).split(/[\\/]/).pop()}
status: active
tags: #rule, #setup
---

# Quy tắc Dự án (Workspace Rules)

${ruleContent}
`;
      writeFileSync(targetPath, template, 'utf-8');
      spinner.succeed(chalk.green(`✓ Rule "${ruleName}" installed successfully (fresh)!`));
    } else {
      // Append if it's not already installed
      let currentContent = readFileSync(targetPath, 'utf-8');
      
      // Basic check to see if rule might already be in the file
      if (currentContent.includes(ruleContent.trim().substring(0, 100))) {
        spinner.warn(chalk.yellow(`Rule "${ruleName}" seems to be already installed in ${targetPath}`));
        console.log(chalk.dim('  Use --force to overwrite entire file.'));
        process.exit(0);
      }

      currentContent += `\n\n---\n\n${ruleContent}\n`;
      writeFileSync(targetPath, currentContent, 'utf-8');
      spinner.succeed(chalk.green(`✓ Rule "${ruleName}" appended to ${targetPath} successfully!`));
    }

    console.log(chalk.dim(`  Path: ${targetPath}`));
    console.log(chalk.dim(`  Run "npx skills sync-rules" to propagate to other IDE agents.`));

  } catch (err) {
    spinner.fail(chalk.red(`Installation failed: ${err.message}`));
    process.exit(1);
  }
}
