// @ts-check
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { getSkillNames, SKILLS, getRuleNames, RULES } from '../registry.js';

/**
 * CLI Wizard interactive menu
 */
export async function runWizard() {
  console.clear();

  p.intro(chalk.bgHex('#6366F1').black(' Tuquet Skills Manager v1.0 '));

  const action = await p.select({
    message: 'Chọn tác vụ:',
    options: [
      { value: 'install-skill', label: '📦  Cài đặt Skill' },
      { value: 'install-rule', label: '📋  Cài đặt Rule' },
      { value: 'update', label: '🔄  Cập nhật Skills đã cài' },
      { value: 'sync', label: '🔗  Đồng bộ Rules sang IDE' },
      { value: 'exit', label: '❌  Thoát' },
    ],
  });

  if (p.isCancel(action) || action === 'exit') {
    p.outro(chalk.gray('Hẹn gặp lại!'));
    process.exit(0);
  }

  if (action === 'install-skill') {
    const skillNames = getSkillNames();
    if (skillNames.length === 0) {
      p.note('Chưa có skill nào trong Registry.', 'Thông báo');
      p.outro(chalk.gray('Kết thúc.'));
      process.exit(0);
    }

    const selected = await p.multiselect({
      message: 'Chọn skill muốn cài (Space để chọn, Enter để xác nhận):',
      options: skillNames.map(name => ({
        value: name,
        label: `${name}  ${chalk.dim(SKILLS[name].description)}`,
      })),
      required: true,
    });

    if (p.isCancel(selected)) {
      p.outro(chalk.gray('Đã hủy.'));
      process.exit(0);
    }

    const location = await p.select({
      message: 'Nơi cài đặt:',
      options: [
        { value: 'local', label: '📁  Workspace hiện tại  (.agents/skills/)' },
        { value: 'global', label: '🌍  Toàn cục           (~/.gemini/config/skills/)' },
      ],
    });

    if (p.isCancel(location)) {
      p.outro(chalk.gray('Đã hủy.'));
      process.exit(0);
    }

    const isGlobal = location === 'global';

    const overwrite = await p.confirm({
      message: 'Ghi đè nếu skill đã tồn tại?',
      initialValue: true,
    });

    if (p.isCancel(overwrite)) {
      p.outro(chalk.gray('Đã hủy.'));
      process.exit(0);
    }

    p.note(chalk.cyan(`Đang cài ${selected.length} skill...`), '⏳');

    const { installSkill } = await import('./install.js');
    let success = 0, fail = 0;
    for (const name of selected) {
      try {
        await installSkill(name, overwrite, isGlobal);
        success++;
      } catch {
        fail++;
      }
    }

    if (fail === 0) {
      p.outro(chalk.green(`✓ Đã cài ${success} skill thành công.`));
    } else {
      p.outro(chalk.yellow(`✓ ${success} thành công, ${fail} thất bại.`));
    }
  }

  if (action === 'install-rule') {
    const ruleNames = getRuleNames();
    if (ruleNames.length === 0) {
      p.note('Chưa có rule nào trong Registry.', 'Thông báo');
      p.outro(chalk.gray('Kết thúc.'));
      process.exit(0);
    }

    const selected = await p.multiselect({
      message: 'Chọn rule muốn cài (Space để chọn, Enter để xác nhận):',
      options: ruleNames.map(name => ({
        value: name,
        label: `${name}  ${chalk.dim(RULES[name].description)}`,
      })),
      required: true,
    });

    if (p.isCancel(selected)) {
      p.outro(chalk.gray('Đã hủy.'));
      process.exit(0);
    }

    const location = await p.select({
      message: 'Nơi cài đặt:',
      options: [
        { value: 'local', label: '📁  Workspace hiện tại  (.agents/AGENTS.md)' },
        { value: 'global', label: '🌍  Toàn cục           (~/.gemini/config/AGENTS.md)' },
      ],
    });

    if (p.isCancel(location)) {
      p.outro(chalk.gray('Đã hủy.'));
      process.exit(0);
    }

    const isGlobal = location === 'global';

    let ignoreGit = false;
    if (!isGlobal) {
      ignoreGit = await p.confirm({
        message: 'Thêm vào .gitignore?',
        initialValue: true,
      });
      if (p.isCancel(ignoreGit)) {
        p.outro(chalk.gray('Đã hủy.'));
        process.exit(0);
      }
    }

    const overwrite = await p.confirm({
      message: 'Ghi đè AGENTS.md hay chèn thêm vào cuối?',
      initialValue: false,
    });

    if (p.isCancel(overwrite)) {
      p.outro(chalk.gray('Đã hủy.'));
      process.exit(0);
    }

    p.note(chalk.cyan(`Đang cài ${selected.length} rule...`), '⏳');

    const { installRule } = await import('./install-rule.js');
    let isFirst = true;
    for (const name of selected) {
      await installRule(name, isFirst ? overwrite : false, isGlobal, ignoreGit);
      isFirst = false;
    }

    p.outro(chalk.green(`✓ Đã cài ${selected.length} rule.`));
  }

  if (action === 'update') {
    p.note(chalk.cyan('Đang quét skills đã cài...\n'), '🔄');
    const { updateSkills } = await import('./update.js');
    await updateSkills();
  }

  if (action === 'sync') {
    p.note(chalk.cyan('Đang đồng bộ rules sang các IDE config...\n'), '🔗');
    const { syncRules } = await import('./sync-rules.js');
    await syncRules();
  }
}