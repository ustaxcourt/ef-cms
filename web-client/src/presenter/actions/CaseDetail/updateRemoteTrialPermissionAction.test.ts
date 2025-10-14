import { state } from '@web-client/presenter/app.cerebral';

/**
 * Updates the remote trial permission for a case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const updateRemoteTrialPermissionAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const modalState = get(state.modal);
  let { remoteTrialGrantedDate } = modalState;

  if (remoteTrialGrantedDate && remoteTrialGrantedDate.trim() !== '') {
    const FORMATS = applicationContext.getConstants().DATE_FORMATS;

    const inputFormat = applicationContext
      .getUtilities()
      .getDateFormat(remoteTrialGrantedDate, [
        FORMATS.MDYYYY,
        FORMATS.MMDDYYYY,
      ]);

    remoteTrialGrantedDate = applicationContext
      .getUtilities()
      .createISODateString(remoteTrialGrantedDate, inputFormat);
  }

  const hasDate = Boolean(
    remoteTrialGrantedDate && remoteTrialGrantedDate.trim() !== '',
  );

  const currentCase = get(state.caseDetail);

  const caseDetails = {
    ...currentCase,
    remoteTrialGranted: hasDate,
    remoteTrialGrantedDate: hasDate ? remoteTrialGrantedDate : null,
  };

  const caseDetail = await applicationContext
    .getUseCases()
    .updateCaseDetailsInteractor(applicationContext, {
      caseDetails,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Remote proceeding permission updated.',
    },
    caseDetail,
  };
};
