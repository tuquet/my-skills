// @ts-check
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';
import { updateGitIgnore } from '../utils/gitignore.js';

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
    const regJsonPath = require.resolve('tuquet-skills-registry/package.json');
    const regDir = dirname(regJsonPath);
    const rulePath = join(regDir, 'rules', ruleFileName);
    if (existsSync(rulePath)) return rulePath;
    return null;
  } catch {
    return null;
  }
}

/**
 * Install a rule template to the target .agents/AGENTS.md
 */
export async function installRule(ruleName, force = false, isGlobal = false, autoIgnore = true) {
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

    const targetDir = isGlobal
      ? resolve(os.homedir(), '.gemini/config')
      : resolve(process.cwd(), '.agents');
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
project: ${isGlobal ? 'global' : resolve(process.cwd()).split(/[\\/]/).pop()}
status: active
tags: #rule, #setup
---

# ${isGlobal ? 'Quy tắc Toàn cục (Global Rules)' : 'Quy tắc Dự án (Workspace Rules)'}

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

    if (!isGlobal) {
      console.log(chalk.dim(`  Run "npx skills sync-rules" to propagate to other IDE agents.`));
      // Auto ignore local rules
      if (autoIgnore) {
        updateGitIgnore();
      }
    }

  } catch (err) {
    spinner.fail(chalk.red(`Installation failed: ${err.message}`));
    process.exit(1);
  }
}
