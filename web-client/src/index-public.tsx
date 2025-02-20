import {
  RouterProvider,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { todaysOpinionsRoute } from 'web-client-public/src/routes/todays-opinions/TodaysOpinions';
import { rootRoute } from 'web-client-public/src/routes/PublicRoot';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { publicDefaultLayoutRoute } from 'web-client-public/src/routes/_default-layout/_defaultLayoutComponent';
import { publicTrialSessionsRoute } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessions';
import { publicTrialSessionDetailsRoute } from 'web-client-public/src/routes/trial-session-detail/PublicaTrialSessionDetails';
import { healthCheckRoute } from 'web-client-public/src/routes/health/HealthCheck';
import { maintenanceRoute } from 'web-client-public/src/routes/maintenance/Maintenance';

const catchAllRouteInFile = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
}).lazy(() => import('@web-client/appPublic').then(app => app.catchAllRoute));

const routeTree = rootRoute.addChildren([
  publicDefaultLayoutRoute.addChildren([
    todaysOpinionsRoute,
    publicTrialSessionsRoute,
    publicTrialSessionDetailsRoute,
    healthCheckRoute,
  ]),
  maintenanceRoute,
  catchAllRouteInFile,
]);

const queryClient = new QueryClient(); // Need to modify default behavior of retrying failed requests

const router = createRouter({
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  routeTree,
  context: {
    queryClient,
  },
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

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
