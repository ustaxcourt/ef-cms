import { createRoute } from '@tanstack/react-router';
import React from 'react';
import { rootRoute } from 'web-client-public/src/routes/PublicRoot';

export function TodaysOpinions() {
  return (
    <>
      <h1>TODAYS OPINIONS</h1>
    </>
  );
}

export const todaysOpinionsRoute = createRoute({
  component: TodaysOpinions,
  getParentRoute: () => rootRoute,
  path: '/todays-opinions',
});
