import { state } from '@web-client/presenter/app.cerebral';

export const removePetitionerEmailAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const email = get(state.modal.petitionerEmailToRemove);
  const { docketNumber } = caseDetail;

  try {
    await applicationContext
      .getUseCases()
      .removePetitionerEmailInteractor(applicationContext, {
        docketNumber,
        email,
      });
  } catch (error) {
    return path.error({
      alertError: {
        message: `Unable to remove email. Please try again.`,
      },
    });
  }

  return path.success({
    alertSuccess: {
      message: 'Changes saved.',
    },
  });
};
