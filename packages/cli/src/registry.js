export const SKILLS = {
  'automa-schema': {
    name: 'automa-schema',
    description: 'Hiểu và thao tác với cấu trúc kịch bản Automa (JSON).',
    version: '1.0.0',
    category: 'Automa / Omni Extension',
    author: 'OpenCode Skills',
    keywords: ['automa', 'workflow', 'automation', 'omni-extension'],
    path: 'automa-schema/',
    files: [
      'SKILL.md',
      'references/blocks_usage.md',
      'references/directoring_structure.md',
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

