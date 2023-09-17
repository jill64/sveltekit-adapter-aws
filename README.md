# sveltekit-adapter-aws

AWS adapter for SvelteKit with multiple architecture

## Introduction

If you are building a SPA, consider AWS Amplify + [adapter-static](https://kit.svelte.dev/docs/single-page-apps).  
If you want to use always-on servers (not serverless), consider EC2 (ECR) + [adapter-node](https://kit.svelte.dev/docs/adapter-node).

## Install

1. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) in local machine

2. [Configure authentication and access credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html) in AWS CLI

3. Install adapter in your project

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
      deploy: true
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
- [lambda-s3](./docs/lambda-s3/README.md)(WIP)(Default)
- [edge-bundled](./docs/edge-bundled/README.md)(WIP)
- [edge-unbundled](./docs/edge-unbundled/README.md)(WIP)

|                | Streaming | Scaling | Round Trip |
| -------------- | --------- | ------- | ---------- |
| lambda-mono    | ✅        |         | ✅         |
| lambda-s3      | ✅        | ✅      | ✅         |
| edge-bundled   |           | ✅      | ✅         |
| edge-unbundled | ✅        | ✅      |            |

## CI/CD

[GitHub Actions Example](./.github/workflows)

1. Setup AWS CLI
2. Setup AWS Credential
3. Build Application

## Manual Deploy

If the automatic deployment option is false, you can deploy the app at any time by running the following command after the app build is complete.

```sh
cd ./build && npx cdk deploy
```

## Directory

### Package

- dist - Export Adapter
- embed - Server Source
- cdk - AWS-CDK Stacks

### App

|     |                                       |
| --- | ------------------------------------- |
| #   | Copy files from package by setup step |
| $   | Copy files from package by build step |
| \*  | Injection value by build step         |
| +   | Generate files by build step          |

- .sveltekit
  - adapter-aws
    - external
      - params(\*)
      - types(#)
      - utils(#)
    - server
      - index.ts($)
    - index.js
    - manifest.js
- build
  - \[resource\] - lambda | s3 | edge
    - assets
      - \_app(+)
      - \[pre-rendered\](+)
      - ...static(+)
      - ...pre-rendered(+)
    - server.js(+)
  - bin
    - cdk-stack.ts($)
    - synth.ts(#)
  - cdk.json(#)
