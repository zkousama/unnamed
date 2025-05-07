import { defineConfig } from '@tanstack/react-start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaConfig } from './vite-pwa-config'
import { createTanStackServerFnPlugin } from '@tanstack/server-functions-plugin'

const serverFnsPlugin = createTanStackServerFnPlugin({
  manifestVirtualImportId: 'tsr:server-fn-manifest',
  client: {
    getRuntimeCode: () =>
      `import { createClientRpc } from '@tanstack/react-start/client-runtime'`,
    replacer: (opts) => `createClientRpc(${JSON.stringify(opts.functionId)})`,
  },
  ssr: {
    getRuntimeCode: () =>
      `import { createSsrRpc } from '@tanstack/react-start/ssr-runtime'`,
    replacer: (opts) => `createSsrRpc(${JSON.stringify(opts.functionId)})`,
  },
  server: {
    getRuntimeCode: () =>
      `import { createServerRpc } from '@tanstack/react-start/server-runtime'`,
    replacer: (opts) =>
      `createServerRpc(${JSON.stringify(opts.functionId)}, ${opts.fn})`,
  },
})

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  vite: {
    plugins: [
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      tailwindcss(),
      VitePWA(pwaConfig),
      serverFnsPlugin.client,
      serverFnsPlugin.ssr,
      serverFnsPlugin.server,
    ],
  },
})
