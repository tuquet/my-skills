import * as p from '@clack/prompts';
import chalk from 'chalk';
import { getSkillNames, SKILLS } from '../registry.js';

export async function listSkills() {
  const names = getSkillNames();

  p.intro(chalk.bgHex('#6366F1').black(' Tuquet Skills Registry '));

  if (names.length === 0) {
    p.note(chalk.yellow('Không tìm thấy skill nào trong Registry.'));
    p.outro();
    return;
  }

  let listOutput = '';
  for (const name of names) {
    const skill = SKILLS[name];
    listOutput += `${chalk.cyan(name.padEnd(25))} ${chalk.dim(skill.description)}\n`;
  }

  p.note(listOutput.trimEnd(), `Danh sách Skills (${names.length})`);
  
  p.outro(chalk.dim(`Sử dụng: npx tuquet-skills-cli install <skill-name>`));
}
