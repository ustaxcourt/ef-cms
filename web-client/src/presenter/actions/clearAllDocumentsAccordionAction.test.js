import { clearAllDocumentsAccordionAction } from './clearAllDocumentsAccordionAction';
import { runAction } from 'cerebral/test';

describe('clearAllDocumentsAccordionAction', () => {
  it('should set state.allDocumentsAccordion to empty string', async () => {
    const { state } = await runAction(clearAllDocumentsAccordionAction, {
      state: {
        allDocumentsAccordion: 'whatever',
      },
    });

    expect(state.allDocumentsAccordion).toEqual('');
  });
});
