import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultFilersMapAction } from '../actions/setDefaultFilersMapAction';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { getCaseAssociationAction } from '@web-client/presenter/actions/getCaseAssociationAction';
import { isUserAssociatedWithTrialSessionAction } from '@web-client/presenter/actions/isUserDirectlyAssociatedToCaseAction';
import { navigateToPathSequence } from '@web-client/presenter/sequences/navigateToPathSequence';

export const gotoFileDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    setDefaultFilersMapAction,
    getCaseAction,
    setCaseAction,
    getCaseAssociationAction,
    isUserAssociatedWithTrialSessionAction,
    {
      yes: [
        setWizardStepAction('SelectDocumentType'),
        setupCurrentPageAction('FileDocumentWizard'),
      ],
      no: [
        () => ({
          path: '404',
        }),
        navigateToPathSequence,
      ],
    },
  ]);
