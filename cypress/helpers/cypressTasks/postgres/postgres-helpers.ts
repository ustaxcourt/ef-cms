import { getUserByEmail } from '../cognito/cognito-helpers';
import { deleteUserConfirmationCode } from '@web-api/persistence/postgres/users/deleteUserConfirmationCode';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getUserConfirmationCode } from '@web-api/persistence/postgres/users/getUserConfirmationCode';

export const getNewAccountVerificationCode = async ({
  email,
}: {
  email: string;
}): Promise<{
  userId: string | undefined;
  confirmationCode: string | undefined;
}> => {
  const { userId } = await getUserByEmail(email);
  if (!userId)
    return {
      confirmationCode: undefined,
      userId: undefined,
    };

  const confirmationCode = await getUserConfirmationCode({ userId });

  return {
    confirmationCode,
    userId,
  };
};

export const expireUserConfirmationCode = async (
  email: string,
): Promise<null> => {
  const { userId } = await getUserByEmail(email);
  if (!userId) return null;

  await deleteUserConfirmationCode({ userId });

  return null;
};

export const getEmailVerificationToken = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const { userId } = await getUserByEmail(email);
  const user = await getUserById({ userId });

  return user.pendingEmailVerificationToken || '';
};
