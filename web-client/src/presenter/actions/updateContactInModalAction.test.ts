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
  });

  it('should update the petitioner contact info in caseDetail state', async () => {
    const contactId = 'abc-123';
    const result = await runAction(updateContactInModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: '1' }],
          docketNumber: '123-45',
          petitioners: [
            {
              contactId,
              name: 'John Doe',
              address1: '123 Main St',
              city: 'Somewhere',
            },
          ],
        },
        modal: {
          form: {
            contact: {
              contactId,
              name: 'John Doe',
              address1: '456 New St',
              city: 'Elsewhere',
            },
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().updateContactInteractor,
    ).toHaveBeenCalled();
    expect(result.state.caseDetail.petitioners[0].address1).toEqual(
      '456 New St',
    );
    expect(result.state.caseDetail.petitioners[0].city).toEqual('Elsewhere');
  });
});
