# my-skills

Skills cá nhân cho AI agents. Mỗi skill là một bộ kiến thức chuyên sâu giúp AI hiểu domain, viết code, và xử lý tác vụ đúng cách.

## Cài đặt

```bash
npx tuquet-skills-cli install <skill-name>
```

## Skills hiện có

| Skill | Mô tả |
|-------|-------|
| `automa` | Workflow automation — JSON structure, blocks, patterns, debugging |

## Commands

```bash
npx tuquet-skills-cli list              # Danh sách skills
npx tuquet-skills-cli info <skill>      # Chi tiết skill
npx tuquet-skills-cli install <skill>   # Cài đặt skill
npx tuquet-skills-cli update            # Cập nhật skills đã cài
```

## Cập nhật skill

Khi skill được cập nhật trên registry:

```bash
npx tuquet-skills-cli install <skill> --force
# hoặc update tất cả
npx tuquet-skills-cli update
```

## Development

```bash
npm install
npm run cli install automa
```