import { resetAddPaperFilingAction } from './resetAddPaperFilingAction';
import { runAction } from 'cerebral/test';

describe('resetAddPaperFilingAction', () => {
  it('sets default properties on state for the add docket entry form', async () => {
    const result = await runAction(resetAddPaperFilingAction, {
      state: {
        currentViewMetadata: undefined,
        form: undefined,
        isEditingDocketEntry: undefined,
        wizardStep: undefined,
      },
    });

    expect(result.state).toMatchObject({
      currentViewMetadata: {
        documentSelectedForScan: 'primaryDocumentFile',
        documentUploadMode: 'scan',
      },
      form: {
        filers: [],
        filersMap: {},
        isPaperFiling: true,
        lodged: false,
        practitioner: [],
      },
      isEditingDocketEntry: false,
      wizardStep: 'PrimaryDocumentForm',
    });
  });
});
