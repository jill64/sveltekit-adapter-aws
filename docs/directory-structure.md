# Directory Structure

## Package

- `dist` - Export Adapter
- `embed` - Server Source
- `cdk` - AWS-CDK Stacks

## App

|     |                                       |
| --- | ------------------------------------- |
| #   | Copy files from package by setup step |
| $   | Copy files from package by build step |
| \*  | Injection value by build step         |
| +   | Generate files by build step          |

- `.sveltekit`
  - `adapter-aws`
    - `external`
      - `params`(\*)
      - `types`(#)
      - `utils`(#)
    - `server`
      - `index.ts`($)
    - `edge`
      - `index.ts`($)
    - `index.js`
    - `manifest.js`
- `build`
  - `[resource]` - lambda | s3 | edge
    - `assets`
      - `_app`(+)
      - `[pre-rendered]`(+)
      - ...`static`(+)
      - ...`pre-rendered`(+)
    - `server.js`(+)
  - `bin`
    - `cdk-stack.ts`($)
    - `synth.ts`(#)
  - `cdk.json`(#)
