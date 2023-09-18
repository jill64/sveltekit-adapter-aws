import { App } from 'aws-cdk-lib'
import { CDKStack } from './cdk-stack'

const app = new App()
new CDKStack(app, '__CDK_STACK_NAME__', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
})
