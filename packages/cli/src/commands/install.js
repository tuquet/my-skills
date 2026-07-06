// @ts-check
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, cpSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import os from 'os';
import chalk from 'chalk';
import * as p from '@clack/prompts';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getSkillSourceDir(skillName) {
  const localPath = resolve(__dirname, '../../../registry/skills', skillName);
  if (existsSync(localPath)) return localPath;

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

export async function installSkill(skillName, force = false, isGlobal = false) {
  const spinner = p.spinner();
  spinner.start(`Đang cài đặt skill "${skillName}"...`);

  try {
    const { getSkill } = await import('../registry.js');
    const skill = getSkill(skillName);

    if (!skill) {
      spinner.stop(chalk.red(`Không tìm thấy skill "${skillName}" trong Registry.`));
      throw new Error(`Skill not found`);
    }

    const sourceDir = getSkillSourceDir(skillName);
    if (!sourceDir) {
      spinner.stop(chalk.red(`Mất kết nối với thư mục nguồn của "${skillName}".`));
      throw new Error(`Source not found`);
    }

    const targetDir = isGlobal
      ? resolve(os.homedir(), '.gemini/config/skills', skillName)
      : resolve(process.cwd(), '.agents/skills', skillName);

    if (existsSync(targetDir) && !force) {
      spinner.stop(chalk.yellow(`Skill "${skillName}" đã tồn tại. Dùng --force để ghi đè.`));
      throw new Error(`Already exists`);
    }

    mkdirSync(targetDir, { recursive: true });
    cpSync(sourceDir, targetDir, { recursive: true });

    spinner.stop(chalk.green(`✓ Skill "${skillName}" đã cài đặt thành công!`));
    p.note(`Location: ${targetDir}`, 'Thông tin');

  } catch (err) {
    if (err.message !== 'Skill not found' && err.message !== 'Source not found' && err.message !== 'Already exists') {
      spinner.stop(chalk.red(`Lỗi cài đặt: ${err.message}`));
    }
    throw err;
  }
}
