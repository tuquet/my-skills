// @ts-check
import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';
import { getSkill } from '../registry.js';
import { installSkill } from './install.js';

/**
 * Update all installed skills in local and global paths
 */
export async function updateSkills() {
  const spinner = ora().start('Checking installed skills...');

  try {
    const localDir = resolve(process.cwd(), '.agents/skills');
    const globalDir = resolve(os.homedir(), '.gemini/config/skills');

    const targets = [];
    if (existsSync(localDir)) targets.push({ dir: localDir, isGlobal: false });
    if (existsSync(globalDir)) targets.push({ dir: globalDir, isGlobal: true });

    if (targets.length === 0) {
      spinner.fail(
        chalk.yellow('Không tìm thấy thư mục kỹ năng nào.\n') +
        chalk.dim('  Cả local (.agents/skills) và global (~/.gemini/config/skills) đều trống.')
      );
      return;
    }

    for (const { dir, isGlobal } of targets) {
      const label = isGlobal ? 'Global (~/.gemini/config/skills)' : 'Local (.agents/skills)';
      console.log(chalk.bold(`\n📁 Kiểm tra: ${label}`));

      const installedSkills = readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      if (installedSkills.length === 0) {
        console.log(chalk.dim('  Không có kỹ năng nào.'));
        continue;
      }

      for (const skillName of installedSkills) {
        const skillMeta = getSkill(skillName);
        if (!skillMeta) {
          console.log(chalk.yellow(`⚠ Bỏ qua "${skillName}": không tồn tại trong Registry.`));
          continue;
        }
        console.log(chalk.bold(`\n> Cập nhật: ${skillName}...`));
        await installSkill(skillName, true, isGlobal);
      }
    }

    console.log(chalk.bold(chalk.green('\n✓ Quá trình cập nhật hoàn tất!')));

  } catch (err) {
    spinner.fail(chalk.red(`Cập nhật thất bại: ${err.message}`));
    process.exit(1);
  }
}