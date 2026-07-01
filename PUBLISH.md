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

## Bước 3: Tạo token (nếu chưa có)
```bash
npm token create --read-only=false --name=automa-publish --scopes=@tuquet --bypass-2fa
```
Nhập password, OTP từ email, copy token hiện ra.

## Bước 4: Set token vào .npmrc
```bash
npm config set //registry.npmjs.org/:_authToken <token>
```

Kiểm tra:
```bash
npm whoami
# => tuquet
```

## Bước 5: Publish registry trước
```bash
npm run publish:registry
```

## Bước 6: Publish CLI
```bash
npm run publish:cli
```

## Bước 7: Kiểm tra
```bash
npm view tuquet-skills-registry
npm view tuquet-skills-cli
npx tuquet-skills-cli --help
```