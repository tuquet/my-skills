// @ts-check
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';
import os from 'os';
import chalk from 'chalk';
import * as p from '@clack/prompts';

export async function uninstallSkill(skillName, isGlobal = false) {
  const spinner = p.spinner();
  spinner.start(`Đang gỡ cài đặt "${skillName}"...`);

  try {
    const targetDir = isGlobal
      ? resolve(os.homedir(), '.gemini/config/skills', skillName)
      : resolve(process.cwd(), '.agents/skills', skillName);

    if (!existsSync(targetDir)) {
      spinner.stop(chalk.yellow(`Skill "${skillName}" chưa được cài đặt.`));
      throw new Error('Not installed');
    }

    rmSync(targetDir, { recursive: true, force: true });
    spinner.stop(chalk.green(`✓ Đã gỡ bỏ "${skillName}".`));
  } catch (err) {
    if (err.message !== 'Not installed') {
      spinner.stop(chalk.red(`Lỗi gỡ cài đặt: ${err.message}`));
    }
    throw err;
  }
}
