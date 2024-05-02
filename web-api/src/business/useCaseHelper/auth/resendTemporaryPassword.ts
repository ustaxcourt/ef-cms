import { ServerApplicationContext } from '@web-api/applicationContext';

export async function resendTemporaryPassword(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
    });

  if (!user) {
    throw new Error(
      `Could not resend temporary password for email: ${email}. Account not found.`,
    );
  }

  await applicationContext.getUserGateway().createUser(applicationContext, {
    attributesToUpdate: {
      userId: user.userId,
    },
    email,
    resendInvitationEmail: true,
  });
}
