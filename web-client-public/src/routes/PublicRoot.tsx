import { createRootRoute, Outlet } from '@tanstack/react-router';
import React from 'react';
import { HeaderPublic } from 'web-client-public/src/routes/PublicHeader';

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <HeaderPublic />
      <Outlet />
    </>
  );
}
