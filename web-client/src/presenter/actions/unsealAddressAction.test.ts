import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsealAddressAction } from './unsealAddressAction';

describe('unsealAddressAction', () => {
  const caseDetail = { docketNumber: '123-20' };
  const mockContactId = '123456';
  const mockDocketNumber = '999-99';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .unsealCaseContactAddressInteractor.mockReturnValue(caseDetail);
  });

  it('makes a call to unseal the case contact using state.contactToSeal and returns a success message', async () => {
    const result = await runAction(unsealAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        contactToSeal: {
          contactId: mockContactId,
          name: 'Bob Barker',
        },
      },
    });

    expect(
      applicationContext.getUseCases().unsealCaseContactAddressInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().unsealCaseContactAddressInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      contactId: mockContactId,
      docketNumber: mockDocketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Address unsealed for Bob Barker.' },
    });
  });

  it('sets state.form.isAddressSealed to false', async () => {
    const result = await runAction(unsealAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        contactToSeal: {
          contactId: mockContactId,
          name: 'Bob Barker',
        },
      },
    });

    expect(result.state.form.isAddressSealed).toBe(false);
  });

  it('throws an error when there is no contact to unseal', async () => {
    await expect(
      runAction(unsealAddressAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketNumber: mockDocketNumber,
          },
        },
      }),
    ).rejects.toThrow('Contact to unseal is required');
  });
});
