import { runAction } from '@web-client/presenter/test.cerebral';
import { setupEditPaperFilingAction } from './setupEditPaperFilingAction';
import { SCANNER_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';

describe('setupEditPaperFilingAction', () => {
  it('should set state.isEditingDocketEntry to true', async () => {
    const { state } = await runAction(setupEditPaperFilingAction, {
      state: {},
    });

    expect(state.isEditingDocketEntry).toBeTruthy();
  });

  it('should set state.wizardStep to PrimaryDocumentForm', async () => {
    const { state } = await runAction(setupEditPaperFilingAction, {
      state: {},
    });

    expect(state.wizardStep).toEqual('PrimaryDocumentForm');
  });

  it('should set state.currentViewMetadata.documentUploadMode to scan', async () => {
    const { state } = await runAction(setupEditPaperFilingAction, {
      state: {},
    });

    expect(state.currentViewMetadata.documentUploadMode).toEqual('scan');
  });

  it('should set state.currentViewMetadata.documentSelectedForScan to primaryDocumentFile', async () => {
    const { state } = await runAction(setupEditPaperFilingAction, {
      state: {},
    });

    expect(state.currentViewMetadata.documentSelectedForScan).toEqual(
      SCANNER_DOCUMENT_TYPES.primaryDocumentFile,
    );
  });
});
