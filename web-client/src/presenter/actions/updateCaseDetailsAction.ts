import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseDetailsAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const form = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...form,
        preferredTrialCity: form.preferredTrialCity
          ? form.preferredTrialCity
          : null,
      },
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
    docketNumber,
    tab: 'caseInfo',
  };
};
