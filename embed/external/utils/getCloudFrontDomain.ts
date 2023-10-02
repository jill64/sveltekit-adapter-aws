export const getCloudFrontDomain = (headers: Record<string, string>) =>
  headers['x-forwarded-host']
