# 🔧 Safenv

> Type-safe environment variable configuration with intelligent validation and parsing

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@withtahmid/safenv.svg)](https://www.npmjs.com/package/@withtahmid/safenv)

## ✨ Features

-   🎯 **Type-Safe**: Full TypeScript support with automatic type inference
-   💡 **IntelliSense**: Auto-completion and suggestions for your environment variables
-   ✅ **Validation**: Built-in validation for required and optional variables
-   🔄 **Type Parsing**: Automatic parsing for strings, numbers, and booleans
-   📝 **Smart Logging**: Comprehensive error and warning messages
-   🛡️ **Fail-Fast**: Throws errors on validation failure to prevent runtime issues
-   🎨 **Clean API**: Simple, intuitive configuration schema

## 📦 Installation

```bash
npm install @withtahmid/safenv
```

```bash
yarn add @withtahmid/safenv
```

```bash
pnpm add @withtahmid/safenv
```

## 🚀 Quick Start

```typescript
import { configEnv, e } from "@withtahmid/safenv";

const env = configEnv(process.env, {
    PORT: e.number().default(3000),
    HOST: e.string(),
    DEBUG: e.boolean().default(false),
    API_KEY: e.string(),
    MAX_RETRIES: e.number().optional(),
});

// Use with full type safety and IntelliSense
console.log(env.PORT); // number
console.log(env.HOST); // string
console.log(env.DEBUG); // boolean
console.log(env.API_KEY); // string
console.log(env.MAX_RETRIES); // number | undefined
```

### 💡 IntelliSense Support

Get auto-completion for all your environment variables:

![Environment Variable Suggestions](./assets/env-suggestions.png)

### 📊 Smart Error & Warning Messages

Clear feedback during application startup:

![Error and Warning Messages](./assets/error-warning-logs.png)

**Example output:**

```
[warn]   Env variable PORT is not set, using default value: 3000
[warn]   Env variable DEBUG is not set, using default value: false
[warn]   Optional env variable MAX_RETRIES is not set and has no default value
[error]  Missing required env variable: HOST
[error]  Missing required env variable: API_KEY
[info]   Environment variables loaded successfully
```

## 📖 Usage

### Basic Configuration

```typescript
import { configEnv, e } from "@withtahmid/safenv";

const env = configEnv(process.env, {
    DATABASE_URL: e.string(),
    PORT: e.number().default(8080),
    ENABLE_CACHE: e.boolean().default(true),
});
```

### Supported Types

#### String (Required by default)

```typescript
const env = configEnv(process.env, {
    API_URL: e.string(),
    API_KEY: e.string().default("default-key"),
    OPTIONAL_VAR: e.string().optional(),
});
```

#### Number (Required by default)

```typescript
const env = configEnv(process.env, {
    PORT: e.number(),
    MAX_CONNECTIONS: e.number().default(100),
    TIMEOUT: e.number().optional(),
});
```

#### Boolean (Required by default)

Accepts: `true`, `false`, `1`, `0`

```typescript
const env = configEnv(process.env, {
    DEBUG: e.boolean(),
    ENABLE_LOGGING: e.boolean().default(false),
    FEATURE_FLAG: e.boolean().optional(),
});
```

### Modifiers

#### `.optional()`

Makes the variable optional. Returns `undefined` if not set.

```typescript
const env = configEnv(process.env, {
    OPTIONAL_API_KEY: e.string().optional(),
    OPTIONAL_PORT: e.number().optional(),
    OPTIONAL_FLAG: e.boolean().optional(),
});
```

#### `.default(value)`

Provides a default value if the variable is not set.

```typescript
const env = configEnv(process.env, {
    PORT: e.number().default(3000),
    NODE_ENV: e.string().default("development"),
    DEBUG: e.boolean().default(false),
});
```

### Status Messages

The function provides two types of status messages:

#### ⚠️ Warning

Default value used or optional variable not set:

```
Env variable DEBUG is not set, using default value: false
Optional env variable API_KEY is not set and has no default value
```

#### ❌ Error

Required variable missing or parsing failed (throws error):

```
Missing required env variable: DATABASE_URL
Invalid number for env variable PORT: abc123
```

## 🎯 Advanced Examples

### Full Application Configuration

```typescript
import { configEnv, e } from "@withtahmid/safenv";

const env = configEnv(process.env, {
    // Server
    NODE_ENV: e.string().default("development"),
    PORT: e.number().default(3000),
    HOST: e.string().default("localhost"),

    // Database
    DATABASE_URL: e.string(),
    DB_POOL_SIZE: e.number().default(10),

    // Redis
    REDIS_HOST: e.string(),
    REDIS_PORT: e.number().default(6379),

    // Features
    ENABLE_CACHE: e.boolean().default(true),
    ENABLE_METRICS: e.boolean().optional(),

    // API Keys
    JWT_SECRET: e.string(),
    API_KEY: e.string(),
});

export default env;
```

## 🔍 Validation Rules

| Scenario             | Modifier      | Default      | Result                    |
| -------------------- | ------------- | ------------ | ------------------------- |
| Value exists & valid | -             | -            | ✅ Success                |
| Value missing        | -             | -            | ❌ Error (throws)         |
| Value missing        | `.optional()` | -            | ⚠️ Warning (undefined)    |
| Value missing        | -             | `.default()` | ⚠️ Warning (uses default) |
| Value invalid format | -             | -            | ❌ Error (throws)         |

## 🛠️ Best Practices

1. **Load configuration early**: Import and configure env at the top of your entry file

    ```typescript
    import { env } from "./config/env";
    // Rest of your imports...
    ```

2. **Use required for critical values**: Don't use `.optional()` or `.default()` for essential config

    ```typescript
    DATABASE_URL: e.string(), // Required, no default
    ```

3. **Provide sensible defaults**: Make development easier

    ```typescript
    PORT: e.number().default(3000),
    NODE_ENV: e.string().default("development"),
    ```

4. **Centralize configuration**: Keep all env configuration in one file

    ```typescript
    // config/env.ts
    export const env = configEnv(process.env, {
        /* ... */
    });
    ```

5. **Type everything**: Leverage TypeScript's type inference
    ```typescript
    // env.PORT is automatically typed as number
    // env.DATABASE_URL is automatically typed as string
    ```

## 📋 Example `.env` File

```env
# Server Configuration
NODE_ENV=production
PORT=8080
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
DB_POOL_SIZE=20

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Features
ENABLE_CACHE=true

# Security
JWT_SECRET=your-secret-key
API_KEY=your-api-key
```

## 🔄 Migration Guide

### From dotenv

```typescript
// Before
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const DATABASE_URL = process.env.DATABASE_URL!;
```

```typescript
// After
import { configEnv, e } from "@withtahmid/safenv";

const env = configEnv(process.env, {
    PORT: e.number().default(3000),
    DATABASE_URL: e.string(),
});
```
