import { restoreFiledWizardDocumentIdsAction } from './restoreFiledWizardDocumentIdsAction';
import { runAction } from 'cerebral/test';

describe('restoreFiledWizardDocumentIdsAction', () => {
  it('should restore documentIds', async () => {
    const result = await runAction(restoreFiledWizardDocumentIdsAction, {
      props: {
        filedDocumentIds: ['Something', 'Forward'],
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.filedDocumentIds).toEqual([
      'Something',
      'Forward',
    ]);
  });
});
