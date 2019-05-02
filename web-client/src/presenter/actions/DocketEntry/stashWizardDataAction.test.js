import { runAction } from 'cerebral/test';
import { stashWizardDataAction } from './stashWizardDataAction';

describe('stashWizardDataAction', () => {
  it('should stash documentId', async () => {
    const result = await runAction(stashWizardDataAction, {
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
