import { runAction } from 'cerebral/test';
import { setupEditPaperFilingAction } from './setupEditPaperFilingAction';

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
      'primaryDocumentFile',
    );
  });
});
