import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@web-client/private-index';
import React from 'react';

function Route2Component() {
  return <Link to='/route2'></Link>
}

export const route2 = createRoute({
  component: Route2Component,
  getParentRoute: () => rootRoute,
  path: '/route2',
});