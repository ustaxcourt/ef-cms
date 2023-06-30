import { clearAllDocumentsAccordionAction } from './clearAllDocumentsAccordionAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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
