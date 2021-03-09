import { resetAddDocketEntryAction } from './resetAddDocketEntryAction';
import { runAction } from 'cerebral/test';

describe('resetAddDocketEntryAction', () => {
  it('sets default properties on state for the add docket entry form', async () => {
    const result = await runAction(resetAddDocketEntryAction, {
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
        lodged: false,
        practitioner: [],
      },
      isEditingDocketEntry: false,
      wizardStep: 'PrimaryDocumentForm',
    });
  });
});
