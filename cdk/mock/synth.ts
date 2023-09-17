import { App } from 'aws-cdk-lib'
import { CDKStack } from './cdk-stack'

const app = new App()
new CDKStack(app, '__CDK_STACK_NAME__')
