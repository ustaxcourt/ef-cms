import { clearModalStateAction } from '../actions/clearModalStateAction';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmServePaperFiledDocumentSequence = [
  clearModalStateAction,
  setRedirectUrlAction,
  setDocketEntryIdAction,
  isDocketEntryMultiDocketableAction,
  {
    no: [],
    yes: [setMultiDocketingCheckboxesAction],
  },
  setShowModalFactoryAction('ConfirmInitiatePaperFilingServiceModal'),
];
