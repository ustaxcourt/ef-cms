import { routerPrivate } from './private-index';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof routerPrivate;
  }
}
