import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateUserContactInformationAction } from './updateUserContactInformationAction';

describe('updateUserContactInformationAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the use case to update the user contact', async () => {
    await runAction(updateUserContactInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: { address1: '999 jump street' },
          email: 'test@example.com',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateUserContactInformationInteractor
        .mock.calls[0][0].contactInfo,
    ).toEqual({
      address1: '999 jump street',
      email: 'test@example.com',
    });
  });
});
