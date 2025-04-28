import { state } from '@web-client/presenter/app.cerebral';

export const removePetitionerEmailAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const petitionerEmailToRemove = get(state.modal.petitionerEmailToRemove);
  const { docketNumber, petitioners } = caseDetail;

  try {
    const updatedPetitioner = await applicationContext
      .getUseCases()
      .removePetitionerEmailInteractor(applicationContext, {
        docketNumber,
        email: petitionerEmailToRemove,
      });

    const petitionerIndex = petitioners.findIndex(
      petitioner => petitioner.email === petitionerEmailToRemove,
    );

    petitioners[petitionerIndex] = {
      ...updatedPetitioner,
    };
  } catch (error) {
    return path.error({
      alertError: {
        message: `Unable to remove email. Please try again.`,
      },
    });
  }

  store.set(state.caseDetail.petitioners, petitioners);
  return path.success({
    alertSuccess: {
      message: 'Changes saved.',
    },
  });
};
