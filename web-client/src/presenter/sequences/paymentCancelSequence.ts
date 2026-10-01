import { clearPaymentFilingFeeOriginAction } from '@web-client/presenter/actions/FilingFee/clearPaymentFilingFeeOriginAction';
import { paymentCancelRouteByOriginAction } from '@web-client/presenter/actions/FilingFee/paymentCancelRouteByOriginAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setStepIndicatorAction } from '@web-client/presenter/actions/setStepIndicatorAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { setStepIndicatorInfoForPetitionGeneratorAction } from '@web-client/presenter/actions/setStepIndicatorInfoForPetitionGeneratorAction';
import { getCaseAssociationAction } from '@web-client/presenter/actions/getCaseAssociationAction';
import { redirectToDashboardAction } from '@web-client/presenter/actions/redirectToDashboardAction';
import { checkCaseAssociationAndPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/checkCaseAssociationAndPaymentStatusAction';
import { setFilingFeeReturnPageAction } from '@web-client/presenter/actions/FilingFee/setFilingFeeReturnPageAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';

export const paymentCancelSequence = [
  paymentCancelRouteByOriginAction,
  {
    dashboard: [
      setFilingFeeReturnPageAction,
      clearPaymentFilingFeeOriginAction,
      setupCurrentPageAction('Interstitial'),
      navigateToPathAction,
    ],
    petition: [
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
    ],
  },
];
