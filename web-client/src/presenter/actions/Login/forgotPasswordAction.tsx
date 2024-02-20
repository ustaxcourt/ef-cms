import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const forgotPasswordAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { email } = get(state.authentication.form);

  try {
    await applicationContext
      .getUseCases()
      .forgotPasswordInteractor(applicationContext, { email });

    return path.success();
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

    if (originalErrorMessage === 'User is unconfirmed') {
      return path.unconfirmedAccount({
        alertWarning: {
          message: (
            <>
              We sent you an email to help you log in. If you don’t see it,
              check your spam folder. If you’re still having trouble, email{' '}
              <a href="mailto:dawson.support@ustaxcourt.gov">
                dawson.support@ustaxcourt.gov
              </a>
              .
            </>
          ),
          title: 'We’ve sent you an email',
        },
      });
    }

    throw err;
  }
};
