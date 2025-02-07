import { createRoute, Outlet } from '@tanstack/react-router';
import React from 'react';
import { PublicFooter } from 'web-client-public/src/routes/PublicFooter';
import { PublicHeader } from 'web-client-public/src/routes/PublicHeader';
import { rootRoute } from 'web-client-public/src/routes/PublicRoot';
import { UsaBanner } from 'web-client-public/src/routes/UsaBanner';

function PublicDefaultLayout() {
  return (
    <>
      <UsaBanner />
      <PublicHeader />
      <main id="main-content" role="main">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}

export const publicDefaultLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_layout',
  component: PublicDefaultLayout,
});
