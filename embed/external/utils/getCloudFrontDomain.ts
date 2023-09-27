export const getCloudFrontDomain = (headers: Record<string, string>) =>
  headers['via']?.split(' ')?.[1]
