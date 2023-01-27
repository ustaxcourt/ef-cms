import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmServePaperFiledDocumentSequence = [
  setRedirectUrlAction,
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key,
  ),
  setDocketEntryIdAction,
  clearModalStateAction,
  isDocketEntryMultiDocketableAction,
  {
    no: [],
    yes: [setMultiDocketingCheckboxesAction],
  },
  setShowModalFactoryAction('ConfirmInitiatePaperFilingServiceModal'),
];
