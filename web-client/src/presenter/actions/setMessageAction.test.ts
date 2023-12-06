import { runAction } from '@web-client/presenter/test.cerebral';
import { setMessageAction } from './setMessageAction';

describe('setMessageAction', () => {
  it('sets state.caseDetail from props', async () => {
    const { state } = await runAction(setMessageAction, {
      props: {
        messageDetail: {
          messageId: '4b194c7b-6305-4d46-b8dd-6962066574f7',
        },
      },
    });

    expect(state.messageDetail).toEqual({
      messageId: '4b194c7b-6305-4d46-b8dd-6962066574f7',
    });
  });
});
