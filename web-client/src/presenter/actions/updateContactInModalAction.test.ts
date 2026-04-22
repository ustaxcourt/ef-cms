import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateContactInModalAction } from './updateContactInModalAction';

describe('updateContactInModalAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .updateContactInteractor.mockResolvedValue(undefined);
    applicationContext.getUseCases().getCaseInteractor.mockResolvedValue({
      docketNumber: '123-45',
      petitioners: [{ contactId: 'a' }],
    });
  });

  it('should update the contact and refresh caseDetail, preserving docketEntries and messages', async () => {
    const result = await runAction(updateContactInModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: '1' }],
          docketNumber: '123-45',
          messages: [{ messageId: 'm1' }],
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
    expect(
      applicationContext.getUseCases().getCaseInteractor,
    ).toHaveBeenCalled();
    expect(result.state.caseDetail).toEqual({
      docketEntries: [{ docketEntryId: '1' }],
      docketNumber: '123-45',
      messages: [{ messageId: 'm1' }],
      petitioners: [{ contactId: 'a' }],
    });
  });
});
