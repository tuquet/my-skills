# Publish hướng dẫn

## Bước 1: Login npm
```bash
npm login
```
Nhập username: `tuquet`, password, email + OTP (nếu có).

## Bước 2: Kiểm tra đã login
```bash
npm whoami
# => tuquet
```

## Bước 3: Publish registry trước
```bash
npm run publish:registry
```

## Bước 4: Publish CLI
```bash
npm run publish:cli
```

## Bước 5: Kiểm tra
```bash
npm view @tuquet/skills-registry
npm view @tuquet/skills-cli
npx @tuquet/skills-cli --help
```