import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import { route2 } from '@web-client/route2';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function PrivateRootComponent() {
  return <h1>Hola</h1>;
}
export const rootRoute = createRootRoute({
  component: PrivateRootComponent,
});

export const route1 = createRoute({
  component: () => <></>,
  getParentRoute: () => rootRoute,
  path: '/route1',
});

const routeTree = rootRoute.addChildren([route1, route2]);

const queryClient = new QueryClient(); // Need to modify default behavior of retrying failed requests

export const routerPrivate = createRouter({
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  routeTree,
  context: {
    queryClient,
  },
});

const rootElement = window.document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routerPrivate} />
    </QueryClientProvider>,
  );
}
