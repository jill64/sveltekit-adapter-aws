const routes = ['/unknown-route', '/csr', '/ssg', '/redirect-server']

export const load = ({ data }) => {
  return {
    ...data,
    routes
  }
}
