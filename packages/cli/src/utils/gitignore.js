// @ts-check
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/**
 * Automatically update .gitignore to ignore local AI Agent files
 */
export function updateGitIgnore(silent = false) {
  try {
    const gitignorePath = join(process.cwd(), '.gitignore');
    
    const linesToIgnore = [
      '# AI Agent Rules',
      '.agents/',
      '.cursorrules',
      '.windsurfrules',
      '.clinerules',
    ];

    let content = '';
    if (existsSync(gitignorePath)) {
      content = readFileSync(gitignorePath, 'utf-8');
    }

    // Check if the rules are already ignored (checking for .agents/)
    if (content.includes('.agents/') && content.includes('.cursorrules')) {
      if (!silent) {
        console.log(chalk.dim('  .gitignore already ignores AI Agent rules. Skipping.'));
      }
      return;
    }

    // Format new block
    const prefix = content.length > 0 && !content.endsWith('\n') ? '\n\n' : '\n';
    const ignoreBlock = prefix + linesToIgnore.join('\n') + '\n';
    
    writeFileSync(gitignorePath, content + ignoreBlock, 'utf-8');
    
    if (!silent) {
      console.log(chalk.green('✓ Updated .gitignore to exclude local agent rules!'));
    }
  } catch (err) {
    if (!silent) {
      console.log(chalk.yellow(`⚠ Cannot update .gitignore: ${err.message}`));
    }
  }
}
