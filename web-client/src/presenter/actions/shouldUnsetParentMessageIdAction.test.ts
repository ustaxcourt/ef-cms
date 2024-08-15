import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { shouldUnsetParentMessageIdAction } from './shouldUnsetParentMessageIdAction';

describe('shouldUnsetParentMessageIdAction,', () => {
  const mockYesPath = jest.fn();
  const mockNoPath = jest.fn();

  presenter.providers.path = {
    no: mockNoPath,
    yes: mockYesPath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should not unset parent message id when it exists in props', async () => {
    await runAction(shouldUnsetParentMessageIdAction, {
      modules: {
        presenter,
      },
      props: {
        parentMessageId: 'test',
      },
      state: {},
    });

    expect(mockNoPath).toHaveBeenCalled();
  });

  it('should unset parent message id when it does not exist in props', async () => {
    await runAction(shouldUnsetParentMessageIdAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });

    expect(mockYesPath).toHaveBeenCalled();
  });
});
