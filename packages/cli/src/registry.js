export const SKILLS = {
  'automa': {
    name: 'automa',
    description: 'Hiểu và thao tác với cấu trúc kịch bản Automa (JSON).',
    version: '1.0.0',
    category: 'Automa',
    author: 'tuquet',
    keywords: ['automa', 'workflow', 'automation'],
    path: 'automa/',
    files: [
      'SKILL.md',
      'references/blocks_usage.md',
      'references/directoring_structure.md',
      'references/dom_selector_guide.md',
      'references/qa_knowledge.md',
      'references/baseline_template.automa.json',
    ],
  },
  'test-cases': {
    name: 'test-cases',
    description: 'Phân tích yêu cầu, tạo test case chuẩn. Agent tự sinh test case từ mô tả nghiệp vụ.',
    version: '1.0.0',
    category: 'QA / Testing',
    author: 'tuquet',
    keywords: ['test case', 'test cases', 'testing', 'qa'],
    path: 'test-cases/',
    files: [
      'SKILL.md',
      'examples/auth/login/index.md',
      'examples/auth/login/TC-001-login-success.md',
      'examples/auth/login/TC-002-login-wrong-password.md',
      'examples/auth/login/TC-003-login-empty-fields.md',
    ],
  },
};

export const RULES = {
  'git-commit': {
    name: 'git-commit',
    description: 'Quy tắc đặt tên commit chuẩn (Conventional Commits).',
    version: '1.0.0',
    category: 'Standards',
    file: 'git-commit.md',
  },
  'nodejs-esm': {
    name: 'nodejs-esm',
    description: 'Quy tắc viết code NodeJS ES Modules chuẩn.',
    version: '1.0.0',
    category: 'Standards',
    file: 'nodejs-esm.md',
  },
};

export function getSkillNames() {
  return Object.keys(SKILLS);
}

export function getSkill(name) {
  return SKILLS[name] || null;
}

export function getRuleNames() {
  return Object.keys(RULES);
}

export function getRule(name) {
  return RULES[name] || null;
}

