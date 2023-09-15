# sveltekit-adapter-aws

AWS adapter for SvelteKit with multiple architecture

## Introduction

If you are building a SPA, consider AWS Amplify + [adapter-static](https://kit.svelte.dev/docs/single-page-apps).  
If you want to use always-on servers (not serverless), consider EC2 (ECR) + [adapter-node](https://kit.svelte.dev/docs/adapter-node).

## Install

```sh
npm i -D @jill64/sveltekit-aws-adapter
```

## Quick Example

```js
// svelte.config.js
import adapter from '@jill64/sveltekit-aws-adapter'

const config = {
  // ...
  kit: {
    adapter: adapter({
      // ...
      // Options
      // ...
    })
  }
}

export default config
```

## Config

See [Adapter Options](./packages/adapter/src/types/AdapterOptions.ts)

## Architecture

This adapter allows you to choose from multiple architectures depending on your use case.

- [lambda-mono](./docs/lambda-mono/README.md)
- [lambda-s3](./docs/lambda-s3/README.md)
- [edge-bundled](./docs/edge-bundled/README.md)
- [edge-unbundled](./docs/edge-unbundled/README.md)

|                | Streaming | Scaling | Round Trip | Same Origin |
| -------------- | --------- | ------- | ---------- | ----------- |
| lambda-mono    | ✅        |         | ✅         | ✅          |
| lambda-s3      | ✅        | ✅      | ✅         |             |
| edge-bundled   |           | ✅      | ✅         | ✅          |
| edge-unbundled | ✅        | ✅      |            | ✅          |

## Manual Deploy

WIP
