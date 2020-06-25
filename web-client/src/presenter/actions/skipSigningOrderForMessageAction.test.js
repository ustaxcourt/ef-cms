import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { skipSigningOrderForMessageAction } from './skipSigningOrderForMessageAction';

describe('skipSigningOrderForMessageAction', () => {
  it('should redirect to the draft documents', async () => {
    const result = await runAction(skipSigningOrderForMessageAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          caseId: 'abc-123',
        },
        parentMessageId: '88a94c63-fb5e-4deb-a743-e2d5e882ae6e',
      },
    });
    expect(result.output.path).toEqual(
      '/case-messages/abc-123/message-detail/88a94c63-fb5e-4deb-a743-e2d5e882ae6e',
    );
  });

  it('should set a success message', async () => {
    const result = await runAction(skipSigningOrderForMessageAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          caseId: 'abc-123',
        },
      },
    });
    expect(result.output.alertSuccess.message).toEqual(
      'Your document has been successfully created and attached to this message',
    );
  });
});
