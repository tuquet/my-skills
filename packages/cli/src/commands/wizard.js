// @ts-check
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { getSkillNames, SKILLS, getRuleNames, RULES } from '../registry.js';

/**
 * CLI Wizard interactive menu
 */
export async function runWizard() {
  console.clear();
  
  p.intro(chalk.bgCyan.black(' OmniAgent Skills & Rules Customizer '));

  const action = await p.select({
    message: 'Bạn muốn thực hiện tác vụ nào?',
    options: [
      { value: 'skills', label: '🛠️  Cài đặt Kỹ năng mới (Install Skills)' },
      { value: 'rules', label: '📝 Cài đặt Quy tắc mới (Install Rules)' },
      { value: 'sync', label: '🔄 Đồng bộ quy tắc chéo IDE (Sync Rules)' },
      { value: 'exit', label: '❌ Thoát' },
    ],
  });

  if (p.isCancel(action) || action === 'exit') {
    p.outro(chalk.yellow('Đã hủy trình hướng dẫn. Hẹn gặp lại!'));
    process.exit(0);
  }

  if (action === 'skills') {
    const skillNames = getSkillNames();
    
    if (skillNames.length === 0) {
      p.note('Không tìm thấy kỹ năng nào trong Registry.', 'Thông báo');
      p.outro(chalk.yellow('Kết thúc!'));
      process.exit(0);
    }

    const selectedSkills = await p.multiselect({
      message: 'Chọn các Kỹ năng bạn muốn cài đặt (Phím Space để chọn, Enter để xác nhận):',
      options: skillNames.map(name => ({
        value: name,
        label: `${name} - ${SKILLS[name].description}`,
      })),
      required: true,
    });

    if (p.isCancel(selectedSkills)) {
      p.outro(chalk.yellow('Đã hủy tác vụ.'));
      process.exit(0);
    }

    const force = await p.confirm({
      message: 'Bạn có muốn ghi đè nếu tệp tin đã tồn tại không? (Force overwrite)',
      initialValue: false,
    });

    if (p.isCancel(force)) {
      p.outro(chalk.yellow('Đã hủy tác vụ.'));
      process.exit(0);
    }

    p.note(chalk.cyan('Đang bắt đầu cài đặt các kỹ năng đã chọn...'));
    
    const { installSkill } = await import('./install.js');
    // @ts-ignore
    for (const skillName of selectedSkills) {
      console.log(chalk.bold(`\n> Đang cài đặt skill: ${skillName}`));
      await installSkill(skillName, force);
    }

    p.outro(chalk.green('✓ Tất cả kỹ năng được chọn đã được xử lý xong!'));
  }

  if (action === 'rules') {
    const ruleNames = getRuleNames();
    
    if (ruleNames.length === 0) {
      p.note('Không tìm thấy quy tắc nào trong Registry.', 'Thông báo');
      p.outro(chalk.yellow('Kết thúc!'));
      process.exit(0);
    }

    const selectedRules = await p.multiselect({
      message: 'Chọn các Quy tắc bạn muốn cài đặt (Phím Space để chọn, Enter để xác nhận):',
      options: ruleNames.map(name => ({
        value: name,
        label: `${name} - ${RULES[name].description}`,
      })),
      required: true,
    });

    if (p.isCancel(selectedRules)) {
      p.outro(chalk.yellow('Đã hủy tác vụ.'));
      process.exit(0);
    }

    const force = await p.confirm({
      message: 'Bạn có muốn ghi đè tệp tin AGENTS.md cũ nếu đã tồn tại? (Chọn No để chèn thêm nội dung mới vào cuối tệp)',
      initialValue: false,
    });

    if (p.isCancel(force)) {
      p.outro(chalk.yellow('Đã hủy tác vụ.'));
      process.exit(0);
    }

    p.note(chalk.cyan('Đang bắt đầu cài đặt các quy tắc đã chọn...'));
    
    const { installRule } = await import('./install-rule.js');
    // @ts-ignore
    for (const ruleName of selectedRules) {
      console.log(chalk.bold(`\n> Đang cài đặt rule: ${ruleName}`));
      await installRule(ruleName, force);
    }

    p.outro(chalk.green('✓ Tất cả quy tắc được chọn đã được xử lý xong!'));
  }

  if (action === 'sync') {
    p.note(chalk.cyan('Bắt đầu đồng bộ quy tắc nguồn sang các IDE...'));
    const { syncRules } = await import('./sync-rules.js');
    await syncRules();
    p.outro(chalk.green('✓ Đồng bộ quy tắc hoàn tất!'));
  }
}
