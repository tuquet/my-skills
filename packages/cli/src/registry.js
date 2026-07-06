import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getRegistryDir() {
  const localPath = path.resolve(__dirname, '../../registry');
  if (fs.existsSync(localPath)) return localPath;
  try {
    const require = createRequire(import.meta.url);
    const regJsonPath = require.resolve('tuquet-skills-registry/package.json');
    return path.dirname(regJsonPath);
  } catch {
    return null;
  }
}

const registryDir = getRegistryDir();

function loadSkills() {
  const skills = {};
  if (!registryDir) return skills;
  
  const skillsDir = path.join(registryDir, 'skills');
  if (!fs.existsSync(skillsDir)) return skills;
  
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillName = entry.name;
      const skillPath = path.join(skillsDir, skillName);
      const mdPath = path.join(skillPath, 'SKILL.md');
      
      let description = '';
      let name = skillName;
      let category = 'Uncategorized';
      let version = '1.0.0';
      let tags = [];
      let filesCount = 0;

      try {
        filesCount = fs.readdirSync(skillPath).length;
      } catch (e) {}

      if (fs.existsSync(mdPath)) {
        const content = fs.readFileSync(mdPath, 'utf8');
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        const fm = fmMatch ? fmMatch[1] : content;

        const nameMatch = fm.match(/^name:\s*"?([^"\r\n]+)"?/m);
        if (nameMatch) name = nameMatch[1].trim();
        
        const descMatch = fm.match(/^description:\s*"?([^"\r\n]+)"?/m);
        if (descMatch) description = descMatch[1].trim();

        const catMatch = fm.match(/^category:\s*"?([^"\r\n]+)"?/m);
        if (catMatch) category = catMatch[1].trim();

        const verMatch = fm.match(/^version:\s*"?([^"\r\n]+)"?/m);
        if (verMatch) version = verMatch[1].trim();

        const tagsMatch = fm.match(/^(?:tags|keywords):\s*"?([^"\r\n]+)"?/m);
        if (tagsMatch) {
          tags = tagsMatch[1].replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      
      skills[skillName] = {
        name,
        description,
        category,
        version,
        tags,
        filesCount,
        path: `${skillName}/`,
      };
    }
  }
  return skills;
}

function loadRules() {
  const rules = {};
  if (!registryDir) return rules;
  
  const rulesDir = path.join(registryDir, 'rules');
  if (!fs.existsSync(rulesDir)) return rules;
  
  const entries = fs.readdirSync(rulesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const ruleId = entry.name.replace('.md', '');
      const rulePath = path.join(rulesDir, entry.name);
      
      let description = '';
      let name = ruleId;
      
      const content = fs.readFileSync(rulePath, 'utf8');
      const nameMatch = content.match(/^name:\s*"?([^"\r\n]+)"?/m);
      if (nameMatch) name = nameMatch[1].trim();
      
      const descMatch = content.match(/^description:\s*"?([^"\r\n]+)"?/m);
      if (descMatch) description = descMatch[1].trim();
      
      rules[ruleId] = {
        name,
        description,
        file: entry.name,
      };
    }
  }
  return rules;
}

export const SKILLS = loadSkills();
export const RULES = loadRules();

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
