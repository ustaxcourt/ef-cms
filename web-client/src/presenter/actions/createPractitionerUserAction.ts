import { state } from '@web-client/presenter/app.cerebral';

export const createPractitionerUserAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const practitioner = get(state.form);

  practitioner.confirmEmail = undefined;

  try {
    const practitionerUser = await applicationContext
      .getUseCases()
      .createPractitionerUserInteractor(applicationContext, {
        user: practitioner,
      });

    return path.success({
      alertSuccess: {
        message: 'Practitioner added.',
      },
      barNumber: practitionerUser.barNumber,
      practitionerUser,
    });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Practitioner could not be added.',
      },
    });
  }
};
