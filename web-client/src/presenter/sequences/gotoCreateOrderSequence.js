import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { hasOrderTypeSelectedAction } from '../actions/CourtIssuedOrder/hasOrderTypeSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openCreateOrderChooseTypeModalSequence } from './openCreateOrderChooseTypeModalSequence';
import { parallel } from 'cerebral';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setCreateOrderModalDataOnFormAction } from '../actions/CourtIssuedOrder/setCreateOrderModalDataOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setIsCreatingOrderAction } from '../actions/setIsCreatingOrderAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';

export const gotoCaseDetailWithModal = [
  ...openCreateOrderChooseTypeModalSequence,
  navigateToCaseDetailAction,
];

export const gotoCreateOrderSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setRedirectUrlAction,
      hasOrderTypeSelectedAction,
      {
        no: gotoCaseDetailWithModal,
        proceed: [
          unsetDocumentToEditAction,
          clearModalAction,
          setCurrentPageAction('Interstitial'),
          stopShowValidationAction,
          clearFormAction,
          setCreateOrderModalDataOnFormAction,
          setIsCreatingOrderAction,
          convertHtml2PdfSequence,
          parallel([
            [
              getConsolidatedCasesByCaseAction,
              setConsolidatedCasesForCaseAction,
            ],
            [
              getFeatureFlagFactoryAction(
                getConstants().ALLOWLIST_FEATURE_FLAGS
                  .CONSOLIDATED_CASES_ADD_DOCKET_NUMBERS.key,
              ),
              setFeatureFlagFactoryAction(
                getConstants().ALLOWLIST_FEATURE_FLAGS
                  .CONSOLIDATED_CASES_ADD_DOCKET_NUMBERS.key,
              ),
            ],
          ]),
          setCurrentPageAction('CreateOrder'),
        ],
      },
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
