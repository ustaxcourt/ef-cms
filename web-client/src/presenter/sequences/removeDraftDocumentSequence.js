import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteDraftDocumentAction } from '../actions/deleteDraftDocumentAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { shouldDeleteOrArchiveDocumentAction } from '../actions/shouldDeleteOrArchiveDocumentAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removeDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  shouldDeleteOrArchiveDocumentAction,
  {
    archive: [archiveDraftDocumentAction],
    delete: [deleteDraftDocumentAction],
  },
  refreshCaseAction,
  resetArchiveDraftDocumentAction,
  navigateToCaseDetailAction,
]);
