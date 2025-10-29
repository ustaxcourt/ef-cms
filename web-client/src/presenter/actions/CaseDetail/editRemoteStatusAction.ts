import { state } from '@web-client/presenter/app.cerebral';
import { Case } from '@shared/business/entities/cases/Case';

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
  const rawCase = get(state.caseDetail);
  const user = get(state.user);
  const currentCase = new Case(rawCase, { authorizedUser: user });
  
  currentCase.setRemoteTrialGrantedDate(remoteTrialGrantedDate);

  const caseDetail = await applicationContext
    .getUseCases()
    .updateCaseDetailsInteractor(applicationContext, {
      caseDetails: currentCase,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Successfully updated motion to proceed remotely date.',
    },
    caseDetail,
  };
};
