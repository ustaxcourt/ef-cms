import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteDraftDocumentAction } from '../actions/deleteDraftDocumentAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setCaseAction } from '../actions/setCaseAction';
import { shouldDeleteOrArchiveDocumentAction } from '../actions/shouldDeleteOrArchiveDocumentAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removeDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  shouldDeleteOrArchiveDocumentAction,
  {
    archive: [archiveDraftDocumentAction],
    delete: [deleteDraftDocumentAction],
  },
  setCaseAction,
  resetArchiveDraftDocumentAction,
  navigateToCaseDetailAction,
]);
