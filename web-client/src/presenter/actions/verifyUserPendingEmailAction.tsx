import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import React from 'react';

export const verifyUserPendingEmailAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps<{ token: string }>) => {
  const { token } = props;

  try {
    await applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor(applicationContext, {
        token,
      });

    return path.success({
      alertSuccess: {
        message:
          'Your email address is verified. You can now log in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e: any) {
    return path.error({
      alertError: {
        message: (
          <>
            Your request cannot be completed. Please try to log in. If you’re
            still having trouble, contact{' '}
            <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
              {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
            </a>
            .
          </>
        ),
        title: 'Unable to complete your request',
      },
    });
  }
};
