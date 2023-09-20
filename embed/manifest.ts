export const manifest = (() => {
  function __memo(fn) {
    let value
    return () => (value ??= value = fn())
  }

  return {
    appDir: '_app',
    appPath: '_app',
    assets: new Set(['favicon.png']),
    mimeTypes: { '.png': 'image/png' },
    _: {
      client: {
        start: '_app/immutable/entry/start.b99e3466.js',
        app: '_app/immutable/entry/app.f94b305f.js',
        imports: [
          '_app/immutable/entry/start.b99e3466.js',
          '_app/immutable/chunks/scheduler.1d0b0a12.js',
          '_app/immutable/chunks/singletons.56e59024.js',
          '_app/immutable/chunks/index.9fb59b91.js',
          '_app/immutable/entry/app.f94b305f.js',
          '_app/immutable/chunks/scheduler.1d0b0a12.js',
          '_app/immutable/chunks/index.622a6ae0.js',
          '_app/immutable/chunks/toast.a703f142.js',
          '_app/immutable/chunks/index.9fb59b91.js'
        ],
        stylesheets: ['_app/immutable/assets/toast.3a6d0da3.css'],
        fonts: []
      },
      nodes: [
        __memo(() => import('./nodes/0.js')),
        __memo(() => import('./nodes/1.js')),
        __memo(() => import('./nodes/2.js')),
        __memo(() => import('./nodes/3.js')),
        __memo(() => import('./nodes/4.js'))
      ],
      routes: [
        {
          id: '/',
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: __memo(() => import('./entries/endpoints/_server.ts.js'))
        },
        {
          id: '/csr',
          pattern: /^\/csr\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null
        },
        {
          id: '/redirect-server',
          pattern: /^\/redirect-server\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null
        }
      ],
      matchers: async () => {
        return {}
      }
    }
  }
})()

export const prerendered = new Set(['/ssg', '/ssg/__data.json'])
