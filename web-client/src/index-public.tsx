import {
  RouterProvider,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { todaysOpinionsRoute } from 'web-client-public/src/routes/todays-opinions/TodaysOpinions';
import { rootRoute } from 'web-client-public/src/routes/PublicRoot';

const catchAllRouteInFile = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
}).lazy(() => import('@web-client/appPublic').then(app => app.catchAllRoute));

const routeTree = rootRoute.addChildren([
  todaysOpinionsRoute,
  catchAllRouteInFile,
]);

const router = createRouter({
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  routeTree,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = window.document.getElementById('app-public')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(<RouterProvider router={router} />);
}
