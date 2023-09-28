import { AwsLambda } from './awslambda.js'

export type LambdaIncomingRequest = Parameters<
  Parameters<AwsLambda['streamifyResponse']>[0]
>[0]
