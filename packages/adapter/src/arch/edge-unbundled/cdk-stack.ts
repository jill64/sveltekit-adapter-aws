// import { Stack, StackProps } from 'aws-cdk-lib'
// import * as lambda from 'aws-cdk-lib/aws-lambda'
// import { Construct } from 'constructs'

// export class EdgeUnbundled extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props)

//     new lambda.Function(this, 'HelloHandler', {
//       runtime: lambda.Runtime.NODEJS_18_X,
//       code: lambda.Code.fromAsset('lambda'),
//       handler: 'hello.handler'
//     })
//   }
// }
