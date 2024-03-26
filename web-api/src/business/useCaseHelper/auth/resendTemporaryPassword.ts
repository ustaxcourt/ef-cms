import { ServerApplicationContext } from '@web-api/applicationContext';

export async function resendTemporaryPassword(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  await applicationContext.getUserGateway().createUser(applicationContext, {
    attributesToUpdate: {},
    email,
    resendInvitationEmail: true,
  });
}
