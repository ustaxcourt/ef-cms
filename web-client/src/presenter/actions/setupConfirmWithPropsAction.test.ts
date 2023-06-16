import { runAction } from '@web-client/presenter/test.cerebral';
import { setupConfirmWithPropsAction } from './setupConfirmWithPropsAction';

describe('setupConfirmWithPropsAction', () => {
  it('sets up confirmation with props', async () => {
    const result = await runAction(setupConfirmWithPropsAction, {
      state: {
        modal: {
          docketEntryIdToEdit: 'abc-123',
          docketNumber: 'abc-123',
          parentMessageId: '987',
        },
        redirectUrl: 'www.example.com',
      },
    });

    expect(result.output).toMatchObject({
      docketEntryIdToEdit: 'abc-123',
      docketNumber: 'abc-123',
      parentMessageId: '987',
      redirectUrl: 'www.example.com',
    });
  });
});
