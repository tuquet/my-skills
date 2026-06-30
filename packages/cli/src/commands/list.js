import chalk from 'chalk';
import { getSkillNames, SKILLS } from '../registry.js';

export async function listSkills() {
  const names = getSkillNames();

  if (names.length === 0) {
    console.log(chalk.yellow('No skills available.'));
    return;
  }

  console.log(chalk.bold(`\n  Available Skills (${names.length})\n`));

  for (const name of names) {
    const skill = SKILLS[name];
    console.log(chalk.cyan(`  ${name.padEnd(20)}`) + chalk.dim(skill.description));
  }

  console.log(chalk.dim(`\n  Run: npx @tuquet/skills-cli install <skill-name>\n`));
}
