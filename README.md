<!----- BEGIN GHOST DOCS HEADER ----->

# @hearchco/sveltekit-adapter-aws

SvelteKit AWS adapter with multiple architectures (only adapter, no deployment)

<!----- END GHOST DOCS HEADER ----->

## Acknowledgements

This project is a fork of [jill64/sveltekit-adapter-aws](https://github.com/jill64/sveltekit-adapter-aws) repository, stripped of CDK deployment code. The point of this repo is to provide a simple adapter for SvelteKit which produces a build that can be afterwards deployed to AWS using any IaC tool (like OpenTofu / Terraform). **This is NOT meant to be an "all-in-one" solution for deploying a SvelteKit app to AWS.**

## Introduction

If you are building a SPA, consider AWS Amplify + [adapter-static](https://kit.svelte.dev/docs/single-page-apps).  
If you want to use always-on servers (not serverless), consider EC2 (ECR) + [adapter-node](https://kit.svelte.dev/docs/adapter-node).

## Install

1. Install adapter in your SvelteKit project (using Github as npm repo)

```sh
npm i -D hearchco/sveltekit-adapter-aws
```

```js
// svelte.config.js
import adapter from '@hearchco/sveltekit-adapter-aws';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			architecture: 'lambda-s3'
		})
	}
};

export default config;
```

See [Full Adapter Options](./packages/adapter/src/types/AdapterOptions.ts)

## Architecture

This adapter allows you to choose from multiple architectures depending on your use case.

| Name                                              | Response Streaming | Assets Scaling | Low Round Trip | Unlimited SSG | Demo Site (Streaming)                          | Demo Site (Bufffered)                                   |
| ------------------------------------------------- | ------------------ | -------------- | -------------- | ------------- | ---------------------------------------------- | ------------------------------------------------------- |
| [lambda-mono](./docs/lambda-mono/README.md)       | ✅                 |                | ✅             |               | [Link](https://lambda-mono.adapter-aws.com)    | [Link](https://buffered.lambda-mono.adapter-aws.com)    |
| [lambda-s3](./docs/lambda-s3/README.md)(Default)  | ✅                 | ✅             | ✅             |               | [Link](https://lambda-s3.adapter-aws.com)      | [Link](https://buffered.lambda-s3.adapter-aws.com)      |
| [edge-bundled](./docs/edge-bundled/README.md)     |                    | ✅             | ✅             | ✅            |                                                | [Link](https://edge-bundled.adapter-aws.com)            |
| [edge-unbundled](./docs/edge-unbundled/README.md) | ✅                 | ✅             |                | ✅            | [Link](https://edge-unbundled.adapter-aws.com) | [Link](https://buffered.edge-unbundled.adapter-aws.com) |

<!----- BEGIN GHOST DOCS FOOTER ----->

## License

[MIT](LICENSE)

<!----- END GHOST DOCS FOOTER ----->
