import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getShouldMarkReadAction } from '../actions/getShouldMarkReadAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryFormForDocketEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForDocketEditAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setFromPageAction } from '../actions/setFromPageAction';
import { setQCWorkItemIdToMarkAsReadIfNeededAction } from '../actions/EditDocketRecord/setQCWorkItemIdToMarkAsReadIfNeededAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTabAction } from '../actions/setTabAction';
import { setWorkItemAsReadAction } from '../actions/setWorkItemAsReadAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const gotoDocketEntryQcSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    setFromPageAction,
    clearScansAction,
    clearFormAction,
    clearModalAction,
    clearScreenMetadataAction,
    getCaseAction,
    setCaseAction,
    setDocketEntryFormForDocketEditAction,
    updateDocketEntryWizardDataAction,
    setDocketEntryIdAction,
    isWorkItemAlreadyCompletedAction,
    {
      no: [],
      yes: [setShowModalFactoryAction('WorkItemAlreadyCompletedModal')],
    },
    setQCWorkItemIdToMarkAsReadIfNeededAction,
    setTabAction('Document Info'),
    setupCurrentPageAction('DocketEntryQc'),
    getShouldMarkReadAction,
    {
      markRead: [setWorkItemAsReadAction],
      noAction: [],
    },
  ]);
