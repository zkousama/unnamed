import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import { PWARegistration } from '../components/PWARegistration'
import { InstallPrompt } from '../components/InstallPrompt'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { TRPCRouter } from '@/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<TRPCRouter>
}

// Fallback component for unmatched routes
function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Render this component when no route matches
  notFoundComponent: NotFound,

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Your App Name' },
      { name: 'description', content: 'Your app description here' },
      { name: 'theme-color', content: '#000000' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'apple-mobile-web-app-title', content: 'Your App Name' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest.json', type: 'application/manifest+json' },
      { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),

  component: () => (
    <RootDocument>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
      <PWARegistration />
      <InstallPrompt />
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark p-5">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
