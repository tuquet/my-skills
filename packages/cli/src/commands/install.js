// @ts-check
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve path to skill files in the registry package
 */
function getSkillSourceDir(skillName) {
  // Try local registry first (monorepo development)
  const localPath = resolve(__dirname, '../../../registry/skills', skillName);
  if (existsSync(localPath)) return localPath;

  // Fallback: resolve from installed tuquet-skills-registry package
  try {
    const require = createRequire(import.meta.url);
    const regJsonPath = require.resolve('tuquet-skills-registry/package.json');
    const regDir = dirname(regJsonPath);
    const skillPath = join(regDir, 'skills', skillName);
    if (existsSync(skillPath)) return skillPath;
    return null;
  } catch {
    return null;
  }
}

/**
 * Install a skill to the target .agents/skills/ directory
 */
export async function installSkill(skillName, force = false, isGlobal = false) {
  const spinner = ora().start();

  try {
    const { getSkill } = await import('../registry.js');
    const skill = getSkill(skillName);

    if (!skill) {
      spinner.fail(chalk.red(`Skill "${skillName}" not found. Run "npx tuquet-skills-cli list" to see available skills.`));
      process.exit(1);
    }

    const sourceDir = getSkillSourceDir(skillName);
    if (!sourceDir) {
      spinner.fail(chalk.red(`Cannot locate skill files for "${skillName}". Is tuquet-skills-registry installed?`));
      process.exit(1);
    }

    const targetDir = isGlobal
      ? resolve(os.homedir(), '.gemini/config/skills', skillName)
      : resolve(process.cwd(), '.agents/skills', skillName);

    // Check if already installed
    if (existsSync(targetDir) && !force) {
      spinner.fail(
        chalk.yellow(`Skill "${skillName}" already exists at ${targetDir}\n`) +
        chalk.dim('  Use --force to overwrite.')
      );
      process.exit(1);
    }

    // Create target directory
    mkdirSync(targetDir, { recursive: true });

    // Copy all files (recursive for nested subdirectories)
    const filesToCopy = ['SKILL.md'];
    const walkRefs = (dir, acc = []) => {
      if (!existsSync(dir)) return acc;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walkRefs(full, acc);
        else if (entry.name.endsWith('.md') || entry.name.endsWith('.json')) acc.push(full.replace(sourceDir, '').replaceAll('\\', '/'));
      }
      return acc;
    };
    for (const sub of ['references', 'examples']) {
      for (const f of walkRefs(join(sourceDir, sub))) {
        if (existsSync(join(sourceDir, f))) filesToCopy.push(f);
      }
    }

    for (const f of filesToCopy) {
      const src = join(sourceDir, f);
      const dest = join(targetDir, f.replace('references/', 'references/'));
      mkdirSync(dirname(dest), { recursive: true });
      const content = readFileSync(src, 'utf-8');
      writeFileSync(dest, content, 'utf-8');
    }

    spinner.succeed(chalk.green(`✓ Skill "${skillName}" installed successfully!`));
    console.log(chalk.dim(`  Location: ${targetDir}`));
    console.log(chalk.dim(`  Files:    ${filesToCopy.length} files copied`));
    const usagePath = isGlobal
      ? `~/.gemini/config/skills/${skillName}/SKILL.md`
      : `.agents/skills/${skillName}/SKILL.md`;
    console.log(chalk.dim(`  Usage:    Refer to ${usagePath} for instructions`));

  } catch (err) {
    spinner.fail(chalk.red(`Installation failed: ${err.message}`));
    process.exit(1);
  }
}
