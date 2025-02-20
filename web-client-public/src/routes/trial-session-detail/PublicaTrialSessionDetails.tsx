import { createRoute } from '@tanstack/react-router';
import React from 'react';
import { publicDefaultLayoutRoute } from 'web-client-public/src/routes/_default-layout/_defaultLayoutComponent';

export function PublicTrialSessionDetails() {
  // const { trialSessionId } = publicTrialSessionDetailsRoute.useParams();
  return (
    <>
      <h1>Hello</h1>
    </>
  );
}

export const publicTrialSessionDetailsRoute = createRoute({
  component: PublicTrialSessionDetails,
  getParentRoute: () => publicDefaultLayoutRoute,
  path: '/trial-session-detail/$trialSessionId',
  // validateSearch: stuff => {
  //   return stuff;
  // },
});
