# Automa Credentials, Syncing, and Encryption

When working with Automa credentials (e.g., `{{secrets@commonPassword}}`), it is critical to understand the deep architecture of how they are encrypted, synced with the backend (Supabase), and decrypted for usage in workflows. Failing to follow these rules will result in corrupted credentials or runtime `TypeError`s during workflow execution.

## 1. Double Encryption Architecture (Supabase Sync)

Automa uses a **Double Encryption** model when syncing credentials to the cloud to ensure zero-knowledge security.

### Layer 1: Local Credential Encryption (`credentialUtil.encrypt`)
When a credential is created or evaluated locally in the extension:
- **Algorithm**: `AES` + `HMAC-SHA256`
- **Key Source**: `getPassKey('credential')` (e.g., `"dev-secret-key-123456789"` or dynamic extension ID).
- **Format Output**: A single string consisting of a `64-character HMAC hex string` immediately followed by the `Base64 AES ciphertext`. 
- **Validation**: During decryption (`credentialUtil.decrypt`), the first 64 characters are sliced and matched against a re-computed HMAC. If it fails, it returns an empty string `''`.

### Layer 2: Cloud Sync Encryption (`BackgroundSyncEngine.js` -> `crypto.js`)
When pushing data to Supabase, the background sync engine wraps the Layer 1 encrypted payload into a second encryption layer:
- **Algorithm**: `AES-GCM`
- **Key Source**: `secrets.encryptionKey` (e.g., `"my-super-secret-static-key-32b!"`).
- **Format Output**: A Base64 string combining a `12-byte random IV` + `Ciphertext`.

**CRITICAL RULE FOR MANUAL SEEDING**: If you manually insert a credential into the `credentials` table in `seed.sql`, you **MUST** apply BOTH encryption layers (Layer 1 first, then Layer 2). If you only apply Layer 1, the Sync Engine will fail to decrypt it during the pull from Supabase. While the system may fallback and store the raw string locally, it causes cloud-sync structure mismatch.

## 2. The JSON.parse Type Coercion Trap (Number vs String)

When `credentialUtil.decrypt()` successfully unpacks the payload, it invokes `parseJSON(decryptedValue, decryptedValue)`. This introduces a severe risk for purely numeric passwords (e.g., `"123456"`).

### The Bug
1. You encrypt the string `"123456"`.
2. Upon decryption, `JSON.parse("123456")` executes successfully.
3. The result is the **Number** `123456`.
4. This Number is passed into the `text-field` or `javascript-code` blocks.
5. If the workflow attempts to use String methods on the credential (e.g., `automaRefData('secrets.commonPassword').trim()`), it will throw a fatal error: `TypeError: Cannot read properties of undefined (reading 'trim')` or `trim is not a function`.

### The Fix
When encrypting purely numeric passwords, you **MUST** include surrounding double quotes in the plaintext string before encryption.
- **Incorrect**: `encryptValue("123456")` -> Decrypts to Number `123456`
- **Correct**: `encryptValue('"123456"')` -> Decrypts to String `"123456"`

By enclosing the string in literal quotes, `JSON.parse('"123456"')` returns a strict Javascript `String`, ensuring all downstream form nodes and string methods work flawlessly.
