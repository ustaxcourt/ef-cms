import { clearPaymentFillingFeeOriginAction } from '@web-client/presenter/actions/FilingFee/clearPaymentFillingFeeOriginAction';
import { paymentCancelRouteByOriginAction } from '@web-client/presenter/actions/FilingFee/paymentCancelRouteByOriginAction';
import { replaceBrowserUrlWithDashboardAction } from '@web-client/presenter/actions/FilingFee/replaceBrowserUrlWithDashboardAction';
import { setFilingFeeAlertsAction } from '@web-client/presenter/actions/FilingFee/setFilingFeeAlertsAction';
import { getOpenAndClosedCasesForUserAction } from '@web-client/presenter/actions/Dashboard/getOpenAndClosedCasesForUserAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setCasesAction } from '@web-client/presenter/actions/setCasesAction';
import { setDefaultCaseTypeToDisplayAction } from '@web-client/presenter/actions/setDefaultCaseTypeToDisplayAction';
import { setStepIndicatorAction } from '@web-client/presenter/actions/setStepIndicatorAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { setStepIndicatorInfoForPetitionGeneratorAction } from '@web-client/presenter/actions/setStepIndicatorInfoForPetitionGeneratorAction';
import { getCaseAssociationAction } from '@web-client/presenter/actions/getCaseAssociationAction';
import { redirectToDashboardAction } from '@web-client/presenter/actions/redirectToDashboardAction';
import { checkCaseAssociationAndPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/checkCaseAssociationAndPaymentStatusAction';

const paymentCancelDashboardReturn = [
  replaceBrowserUrlWithDashboardAction,
  clearPaymentFillingFeeOriginAction,
  setDefaultCaseTypeToDisplayAction,
  setupCurrentPageAction('DashboardExternalUser'),
  getOpenAndClosedCasesForUserAction,
  setCasesAction,
  setFilingFeeAlertsAction,
];

export const paymentCancelSequence = [
  paymentCancelRouteByOriginAction,
  {
    dashboard: [
      clearPaymentFillingFeeOriginAction,
      setDefaultCaseTypeToDisplayAction,
      setupCurrentPageAction('DashboardExternalUser'),
      getOpenAndClosedCasesForUserAction,
      setCasesAction,
      setFilingFeeAlertsAction,
    ],
    petition: [
      getCaseAction,
      setCaseAction,
      getCaseAssociationAction,
      checkCaseAssociationAndPaymentStatusAction,
      {
        dashboard: paymentCancelDashboardReturn,
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
