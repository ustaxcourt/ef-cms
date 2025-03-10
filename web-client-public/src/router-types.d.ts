import { routerPublic } from './index-public';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof routerPublic;
  }
}
