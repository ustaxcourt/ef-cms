import { resetAddPaperFilingAction } from './resetAddPaperFilingAction';
import { runAction } from 'cerebral/test';

describe('resetAddPaperFilingAction', () => {
  it('sets default properties on state for the add docket entry form', async () => {
    const result = await runAction(resetAddPaperFilingAction, {
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'passport',
          documentUploadMode: 'teleport',
        },
        form: {
          lodged: true,
          practitioner: [
            {
              userId: 'hey',
            },
          ],
        },
        isEditingDocketEntry: true,
        wizardStep: 'noooo',
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
        lodged: false,
        practitioner: [],
      },
      isEditingDocketEntry: false,
      wizardStep: 'PrimaryDocumentForm',
    });
  });
});
