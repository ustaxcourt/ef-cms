import {
  DOCUMENT_UPLOAD_MODES,
  SCANNER_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the document upload value in state
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const resetAddCorrespondenceAction = ({ store }: ActionProps) => {
  store.set(
    state.currentViewMetadata.documentUploadMode,
    DOCUMENT_UPLOAD_MODES.scan,
  );
  store.set(
    state.currentViewMetadata.documentSelectedForScan,
    SCANNER_DOCUMENT_TYPES.primaryDocumentFile,
  );
};
