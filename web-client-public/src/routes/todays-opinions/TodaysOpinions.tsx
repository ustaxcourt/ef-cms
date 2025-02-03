import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@web-client/index-public';
import React from 'react';

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
