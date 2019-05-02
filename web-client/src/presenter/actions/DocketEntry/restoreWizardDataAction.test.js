import { restoreWizardDataAction } from './restoreWizardDataAction';
import { runAction } from 'cerebral/test';

describe('restoreWizardDataAction', () => {
  it('should restore documentIds', async () => {
    const result = await runAction(restoreWizardDataAction, {
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
