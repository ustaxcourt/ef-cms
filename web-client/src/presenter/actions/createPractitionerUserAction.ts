import { state } from '@web-client/presenter/app.cerebral';

export const createPractitionerUserAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const practitioner = get(state.form);

  try {
    const { barNumber } = await applicationContext
      .getUseCases()
      .createPractitionerUserInteractor(applicationContext, {
        user: { ...practitioner, confirmEmail: undefined },
      });

    return path.success({
      alertSuccess: {
        message: 'Practitioner added.',
      },
      barNumber,
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
