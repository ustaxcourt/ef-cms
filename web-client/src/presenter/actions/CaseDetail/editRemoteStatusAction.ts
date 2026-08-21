import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls the editRemoteStatusInteractor to indicate remote status
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const editRemoteStatusAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { remoteTrialGrantedDate } = get(state.modal);

  const hasDate = remoteTrialGrantedDate?.trim();

  await applicationContext
    .getUseCases()
    .updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        remoteTrialGranted: !!hasDate,
        remoteTrialGrantedDate: hasDate ? remoteTrialGrantedDate : null,
      },
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Successfully updated motion to proceed remotely date.',
    },
  };
};
