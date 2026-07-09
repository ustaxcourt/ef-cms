import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setStepIndicatorAction } from '@web-client/presenter/actions/setStepIndicatorAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { setStepIndicatorInfoForPetitionGeneratorAction } from '@web-client/presenter/actions/setStepIndicatorInfoForPetitionGeneratorAction';
import { getCaseAssociationAction } from '@web-client/presenter/actions/getCaseAssociationAction';
import { redirectToDashboardAction } from '@web-client/presenter/actions/redirectToDashboardAction';
import { checkCaseAssociationAndPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/checkCaseAssociationAndPaymentStatusAction';

//Does this need a guard once payment has been made??
//Do we need to ensure that this is your case?
export const paymentCancelSequence = [
  getCaseAction,
  setCaseAction,
  getCaseAssociationAction,
  checkCaseAssociationAndPaymentStatusAction,
  {
    success: [
      setStepIndicatorInfoForPetitionGeneratorAction,
      () => {
        return { step: 7 };
      },
      setStepIndicatorAction,
      setupCurrentPageAction('FilePetition'),
    ],
    error: [redirectToDashboardAction],
  },
];
