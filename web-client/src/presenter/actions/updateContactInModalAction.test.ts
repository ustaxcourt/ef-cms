import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateContactInModalAction } from './updateContactInModalAction';

describe('updateContactInModalAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .updateContactInteractor.mockResolvedValue('updated contact');
  });

  it('should update the contact in the modal', async () => {
    const result = await runAction(updateContactInModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: {
          form: {
            contact: {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().updateContactInteractor,
    ).toHaveBeenCalled();
    expect(result.state.caseDetail).toEqual('updated contact');
  });
});
