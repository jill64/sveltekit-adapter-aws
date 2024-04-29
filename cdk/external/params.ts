export const appDir = '__APP_DIR__'
export const base = '__BASE_PATH__'
export const domainName = '__DOMAIN_NAME__'
export const certificateArn = '__CERTIFICATE_ARN__'
export const appPath = `${base}/${appDir}/*`
export const memorySize = 128 /* $$__MEMORY_SIZE__$$ */
export const environment = {} /* $$__ENVIRONMENT__$$ */
export const cdn = false /* $$__ENABLE_CDN__$$ */
export const stream = true /* $$__ENABLE_STREAM__$$ */
export const bridgeAuthToken = '__BRIDGE_AUTH_TOKEN__'
export const lambdaRuntime: 'NODE_LATEST' | 'NODE_20' | 'NODE_18' =
  '__LAMBDA_RUNTIME__' as 'NODE_LATEST'
export const staticAssetsPaths: Set<string> = new Set(
  [] /* $$__STATIC_ASSETS_PATHS__$$ */
)
