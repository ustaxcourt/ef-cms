import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const createNewPetitionerUserAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const petitionerAccountForm = new NewPetitionerUser(
    get(state.form),
  ).toRawObject();

  try {
    const response = await applicationContext
      .getUseCases()
      .signUpUserInteractor(applicationContext, {
        user: petitionerAccountForm,
      });

    return path.success(response);
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

    if (originalErrorMessage === 'User already exists') {
      return path.warning({
        alertWarning: {
          message: (
            <>
              This email address is already associated with an account. You can{' '}
              <a href="/login">log in here</a>. If you forgot your password, you
              can <a href={'/forgot-password'}> request a password reset</a>.
            </>
          ),
          title: 'Email address already has an account',
        },
      });
    } else if (originalErrorMessage === 'User exists, email unconfirmed') {
      return path.error({
        alertError: {
          message: (
            <>
              The email address is associated with an account but is not
              verified. We sent an email with a link to verify the email
              address. If you don&apos;t see it, check your spam folder. If
              you&apos;re still having trouble, please contact{' '}
              <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
                {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
              </a>
              .
            </>
          ),
          title: 'Email address not verified',
        },
      });
    }

    return path.error({
      alertError: {
        message:
          'Could not create user account, please contact DAWSON user support',
        title: 'Error creating account',
      },
    });
  }
};
