import { runAction } from '@web-client/presenter/test.cerebral';
import { setParentMessageIdAction } from './setParentMessageIdAction';

describe('setParentMessageIdAction', () => {
  it('sets state.parentMessageId from props', async () => {
    const { state } = await runAction(setParentMessageIdAction, {
      props: {
        parentMessageId: '4b194c7b-6305-4d46-b8dd-6962066574f7',
      },
    });

    expect(state.parentMessageId).toEqual(
      '4b194c7b-6305-4d46-b8dd-6962066574f7',
    );
  });
});
