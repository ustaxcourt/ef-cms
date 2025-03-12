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
import { publicTrialSessionDetailsRoute } from '@web-client-public/routes/trial-session-detail/PublicTrialSessionDetails';
import { healthCheckRoute } from 'web-client-public/src/routes/health/HealthCheck';
import { maintenanceRoute } from 'web-client-public/src/routes/maintenance/Maintenance';
import { publicSearchRoute } from '@web-client-public/routes/__/PublicSearch';

const catchAllRouteInFile = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
}).lazy(() => import('@web-client/appPublic').then(app => app.catchAllRoute));

const routeTree = rootRoute.addChildren([
  publicDefaultLayoutRoute.addChildren([
    publicSearchRoute,
    todaysOpinionsRoute,
    publicTrialSessionsRoute,
    publicTrialSessionDetailsRoute,
    healthCheckRoute,
  ]),
  maintenanceRoute,
  catchAllRouteInFile,
]);

const queryClient = new QueryClient(); // Need to modify default behavior of retrying failed requests

export const routerPublic = createRouter({
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  routeTree,
  context: {
    queryClient,
  },
});

const rootElement = window.document.getElementById('app-public')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routerPublic} />
    </QueryClientProvider>,
  );
}
