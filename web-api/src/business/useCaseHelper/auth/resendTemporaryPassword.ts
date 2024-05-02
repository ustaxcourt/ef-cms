import { ServerApplicationContext } from '@web-api/applicationContext';

export async function resendTemporaryPassword(
  applicationContext: ServerApplicationContext,
  { email, userId }: { email: string; userId: string },
): Promise<void> {
  await applicationContext.getUserGateway().createUser(applicationContext, {
    attributesToUpdate: {
      userId,
    },
    email,
    resendInvitationEmail: true,
  });
}
