import { getAction } from '../actions/actionFactory';

const openCaseDocumentDownloadUrlAction = getAction(
  'openCaseDocumentDownloadUrlAction',
);

export const openCaseDocumentDownloadUrlSequence = [
  openCaseDocumentDownloadUrlAction,
];
