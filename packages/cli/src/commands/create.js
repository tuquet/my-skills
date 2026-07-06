// @ts-check
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import chalk from 'chalk';
import * as p from '@clack/prompts';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getRegistryDir() {
  const localPath = resolve(__dirname, '../../../registry');
  if (existsSync(localPath)) return localPath;
  try {
    const require = createRequire(import.meta.url);
    const regJsonPath = require.resolve('tuquet-skills-registry/package.json');
    return dirname(regJsonPath);
  } catch {
    return null;
  }
}

export async function createSkill(skillName) {
  p.intro(chalk.bgHex('#6366F1').black(' Tuquet Skills Scaffold '));
  
  const regDir = getRegistryDir();
  if (!regDir) {
    p.note(chalk.red(`Mất kết nối với Registry. Không thể tạo skill.`), 'Lỗi');
    process.exit(1);
  }

  const targetDir = join(regDir, 'skills', skillName);

  if (existsSync(targetDir)) {
    p.note(chalk.yellow(`Skill "${skillName}" đã tồn tại trong Registry.`), 'Cảnh báo');
    process.exit(1);
  }

  const spinner = p.spinner();
  spinner.start(`Đang tạo khung cho skill "${skillName}"...`);

  try {
    mkdirSync(targetDir, { recursive: true });

    const template = `---
name: ${skillName}
description: Mô tả ngắn gọn về kỹ năng này
category: Uncategorized
version: 1.0.0
tags: [tag1, tag2]
---

# ${skillName.toUpperCase()}

Tài liệu hướng dẫn chi tiết cho AI Agent...
`;

    writeFileSync(join(targetDir, 'SKILL.md'), template, 'utf8');

    spinner.stop(chalk.green(`✓ Đã tạo thành công skill "${skillName}"!`));
    p.note(`Đường dẫn: ${targetDir}`, 'Thông tin');
    p.outro(chalk.dim(`Mở file SKILL.md để bắt đầu viết hướng dẫn.`));
  } catch (err) {
    spinner.stop(chalk.red(`Lỗi khi tạo: ${err.message}`));
    process.exit(1);
  }
}
