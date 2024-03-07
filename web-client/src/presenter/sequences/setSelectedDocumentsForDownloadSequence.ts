import { DownloadDocketEntryRequestType } from '@shared/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { setSelectedDocumentIdAction } from '@web-client/presenter/actions/DocketEntry/setSelectedDocumentIdAction';

export const setSelectedDocumentsForDownloadSequence = [
  setSelectedDocumentIdAction,
] as unknown as (props: DownloadDocketEntryRequestType) => void;
