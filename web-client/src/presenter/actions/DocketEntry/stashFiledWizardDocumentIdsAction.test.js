import { runAction } from 'cerebral/test';
import { stashFiledWizardDocumentIdsAction } from './stashFiledWizardDocumentIdsAction';

describe('stashFiledWizardDocumentIdsAction', () => {
  it('should stash documentId', async () => {
    const result = await runAction(stashFiledWizardDocumentIdsAction, {
      props: {
        primaryDocumentFileId: 'Forward',
      },
      state: {
        caseDetail: {},
        form: {
          primaryDocumentFile: {},
        },
        screenMetadata: {
          filedDocumentIds: ['Something'],
        },
      },
    });

    expect(result.output.filedDocumentIds).toEqual(['Something', 'Forward']);
  });
});
