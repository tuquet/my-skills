// @ts-check
import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getSkill } from '../registry.js';
import { installSkill } from './install.js';

/**
 * Update all installed skills in the current workspace
 */
export async function updateSkills() {
  const spinner = ora().start('Checking installed skills...');

  try {
    const targetDir = resolve(process.cwd(), '.agents/skills');

    if (!existsSync(targetDir)) {
      spinner.fail(
        chalk.yellow('Không tìm thấy thư mục kỹ năng local (.agents/skills).\n') +
        chalk.dim('  Chưa có kỹ năng nào được cài đặt trong dự án này.')
      );
      return;
    }

    // Read all directories under .agents/skills/
    const installedSkills = readdirSync(targetDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (installedSkills.length === 0) {
      spinner.fail(chalk.yellow('Không phát hiện thấy kỹ năng nào được cài đặt trong workspace.'));
      return;
    }

    spinner.succeed(chalk.green(`Phát hiện ${installedSkills.length} kỹ năng đã cài đặt.`));

    for (const skillName of installedSkills) {
      const skillMeta = getSkill(skillName);
      
      if (!skillMeta) {
        console.log(chalk.yellow(`⚠ Bỏ qua "${skillName}": Kỹ năng này không tồn tại trong Registry hiện tại.`));
        continue;
      }

      console.log(chalk.bold(`\n> Cập nhật kỹ năng: ${skillName}...`));
      
      // Perform overwrite install local
      await installSkill(skillName, true, false);
    }

    console.log(chalk.bold(chalk.green('\n✓ Quá trình cập nhật các kỹ năng hoàn tất!')));

  } catch (err) {
    spinner.fail(chalk.red(`Cập nhật thất bại: ${err.message}`));
    process.exit(1);
  }
}
