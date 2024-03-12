import {
  SelectedDocumentInfoType,
  setSelectedDocumentIdAction,
} from '@web-client/presenter/actions/DocketEntry/setSelectedDocumentIdAction';

export const setSelectedDocumentsForDownloadSequence = [
  setSelectedDocumentIdAction,
] as unknown as (props: SelectedDocumentInfoType) => void;
