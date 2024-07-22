import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { resetSelectedMessageAction } from '@web-client/presenter/actions/Messages/resetSelectedMessageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetSelectedMessageAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set selectedMessages to a new empty map', async () => {
    const mockId = 'dde0803b-9b76-436d-98e4-928ca6cc416f';
    const mockParentId = 'e566cc5f-63d9-4b59-9752-1102d12c475a';
    const { state } = await runAction(resetSelectedMessageAction, {
      modules: { presenter },
      state: {
        messagesPage: {
          selectedMessages: new Map([
            [mockId, mockParentId],
            [mockParentId, mockId],
          ]),
        },
      },
    });

    expect(state.messagesPage.selectedMessages.size).toEqual(0);
  });
});
