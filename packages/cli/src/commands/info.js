import * as p from '@clack/prompts';
import chalk from 'chalk';
import { getSkill } from '../registry.js';

export async function showInfo(skillName) {
  const skill = getSkill(skillName);

  p.intro(chalk.bgHex('#6366F1').black(' Tuquet Skills Info '));

  if (!skill) {
    p.note(chalk.red(`Không tìm thấy skill "${skillName}".`), 'Lỗi');
    p.outro(chalk.dim('Kết thúc.'));
    process.exit(1);
  }

  let infoStr = ``;
  infoStr += `${chalk.bold('Mô tả:')}    ${chalk.dim(skill.description)}\n`;
  infoStr += `${chalk.bold('Category:')} ${chalk.dim(skill.category)}\n`;
  infoStr += `${chalk.bold('Version:')}  ${chalk.dim(skill.version)}\n`;
  infoStr += `${chalk.bold('Files:')}    ${chalk.dim(skill.filesCount + ' mục')}\n`;
  infoStr += `${chalk.bold('Tags:')}     ${chalk.dim(skill.tags.length ? skill.tags.join(', ') : 'None')}`;

  p.note(infoStr, chalk.cyan(skill.name));

  p.outro(chalk.dim(`Cài đặt: npx tuquet-skills-cli install ${skill.name}`));
}
