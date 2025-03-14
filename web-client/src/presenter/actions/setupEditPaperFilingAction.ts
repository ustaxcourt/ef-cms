import {
  DOCUMENT_UPLOAD_MODES,
  SCANNER_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets various state properties for the edit paper filing form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setupEditPaperFilingAction = ({ store }: ActionProps) => {
  store.set(state.isEditingDocketEntry, true);
  store.set(state.wizardStep, 'PrimaryDocumentForm');
  store.set(
    state.currentViewMetadata.documentUploadMode,
    DOCUMENT_UPLOAD_MODES.scan,
  );
  store.set(
    state.currentViewMetadata.documentSelectedForScan,
    SCANNER_DOCUMENT_TYPES.primaryDocumentFile,
  );
};
