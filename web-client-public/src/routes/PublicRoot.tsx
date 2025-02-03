import { createRootRoute, Outlet } from '@tanstack/react-router';
import React from 'react';

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
