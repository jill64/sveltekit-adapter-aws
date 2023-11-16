<!----- BEGIN GHOST DOCS HEADER ----->

# sveltekit-adapter-aws

[![npm-version](https://img.shields.io/npm/v/@jill64/sveltekit-adapter-aws)](https://npmjs.com/package/@jill64/sveltekit-adapter-aws) [![npm-license](https://img.shields.io/npm/l/@jill64/sveltekit-adapter-aws)](https://npmjs.com/package/@jill64/sveltekit-adapter-aws) [![npm-download-month](https://img.shields.io/npm/dm/@jill64/sveltekit-adapter-aws)](https://npmjs.com/package/@jill64/sveltekit-adapter-aws) [![npm-min-size](https://img.shields.io/bundlephobia/min/@jill64/sveltekit-adapter-aws)](https://npmjs.com/package/@jill64/sveltekit-adapter-aws) [![deploy-test.yml](https://github.com/jill64/sveltekit-adapter-aws/actions/workflows/deploy-test.yml/badge.svg)](https://github.com/jill64/sveltekit-adapter-aws/actions/workflows/deploy-test.yml)

🔌 SveleteKit AWS adapter with multiple architecture

## Install

```sh
npm i @jill64/sveltekit-adapter-aws
```

<!----- END GHOST DOCS HEADER ----->

## Introduction

If you are building a SPA, consider AWS Amplify + [adapter-static](https://kit.svelte.dev/docs/single-page-apps).  
If you want to use always-on servers (not serverless), consider EC2 (ECR) + [adapter-node](https://kit.svelte.dev/docs/adapter-node).

## Install

1. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) in local machine

2. [Configure authentication and access credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html) in AWS CLI

3. Install adapter in your SvelteKit project

```js
// svelte.config.js
import adapter from '@jill64/sveltekit-aws-adapter'

const config = {
  // ...
  kit: {
    adapter: adapter({
      name: 'Your Application Name',
      deploy: true,
      architecture: 'lambda-s3'
      // ...
      // Other Adapter Options
      // ...
    })
  }
}

export default config
```

See [Full Adapter Options](./packages/adapter/src/types/AdapterOptions.ts)

## Architecture

This adapter allows you to choose from multiple architectures depending on your use case.

| Name                                              | Response Streaming | Assets Scaling | Low Round Trip | Unlimited SSG | Demo Site                                      |
| ------------------------------------------------- | ------------------ | -------------- | -------------- | ------------- | ---------------------------------------------- |
| [lambda-mono](./docs/lambda-mono/README.md)       | ✅                 |                | ✅             |               | [Link](https://lambda-mono.adapter-aws.com)    |
| [lambda-s3](./docs/lambda-s3/README.md)(Default)  | ✅                 | ✅             | ✅             |               | [Link](https://lambda-s3.adapter-aws.com)      |
| [edge-bundled](./docs/edge-bundled/README.md)     |                    | ✅             | ✅             | ✅            | [Link](https://edge-bundled.adapter-aws.com)   |
| [edge-unbundled](./docs/edge-unbundled/README.md) | ✅                 | ✅             |                | ✅            | [Link](https://edge-unbundled.adapter-aws.com) |

## CI/CD Pipeline

[GitHub Actions Example](./.github/workflows)

1. Setup AWS CLI (Not required in GitHub Actions)
2. Setup AWS Credential
3. Build Application with `deploy: true` option

## Manual Deploy

If the automatic deployment option is false, you can deploy the app at any time by running the following command after the app build is complete.

```sh
cd ./build && npx cdk deploy
```

## Delete All Resources

```sh
cd ./build && npx cdk destroy --all
```
