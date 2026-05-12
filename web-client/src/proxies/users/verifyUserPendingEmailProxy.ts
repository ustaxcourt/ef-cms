import { put, RequestApplicationContext } from '../requests';

/**
 * Uses `/public-api/verify-email`, which is exposed on both the private API (`app.ts`)
 * and the public API (`app-public.ts`). `/users/verify-email` exists only on
 * the private app, so the public site must hit this route.
 */
export const verifyUserPendingEmailInteractor = (
  applicationContext: RequestApplicationContext,
  { token }: { token: string },
): Promise<void> => {
  return put({
    applicationContext,
    body: {
      token,
    },
    endpoint: '/public-api/verify-email',
  });
};
