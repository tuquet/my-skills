import chalk from 'chalk';
import { getSkill } from '../registry.js';

export async function showInfo(skillName) {
  const skill = getSkill(skillName);

  if (!skill) {
    console.log(chalk.red(`Skill "${skillName}" not found.`));
    process.exit(1);
  }

  console.log(chalk.bold(`\n  ${skill.name}\n`));
  console.log(`  ${chalk.dim('Description:')}  ${skill.description}`);
  console.log(`  ${chalk.dim('Category:')}     ${skill.category}`);
  console.log(`  ${chalk.dim('Version:')}      ${skill.version}`);
  console.log(`  ${chalk.dim('Files:')}        ${skill.files.length} files`);
  console.log(`  ${chalk.dim('Keywords:')}     ${skill.keywords.join(', ')}`);

  console.log(chalk.dim(`\n  Install: npx @tuquet/skills-cli install ${skill.name}\n`));
}
