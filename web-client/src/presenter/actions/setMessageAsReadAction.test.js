import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setMessageAsReadAction } from './setMessageAsReadAction';

describe('setMessageAsReadAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set message as read', async () => {
    await runAction(setMessageAsReadAction, {
      modules: { presenter },
      state: {
        messageDetail: [
          {
            docketNumber: '123-45',
            messageId: '123',
          },
        ],
      },
    });

    expect(
      applicationContext.getUseCases().setMessageAsReadInteractor,
    ).toHaveBeenCalled();
  });
});
