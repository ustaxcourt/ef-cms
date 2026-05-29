import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { sealAddressAction } from './sealAddressAction';

describe('sealAddressAction', () => {
  const caseDetail = { docketNumber: '123-20' };
  const mockContactId = '123456';
  const mockDocketNumber = '999-99';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .sealCaseContactAddressInteractor.mockReturnValue(caseDetail);
  });

  it('makes a call to seal the case contact using state.contactId and returns the updated case detail and success message', async () => {
    const result = await runAction(sealAddressAction, {
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
      applicationContext.getUseCases().sealCaseContactAddressInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().sealCaseContactAddressInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      contactId: mockContactId,
      docketNumber: mockDocketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Address sealed for Bob Barker.' },
    });
  });

  it('sets form.isAddressSealed to true', async () => {
    const { state } = await runAction(sealAddressAction, {
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
        form: {
          isAddressSealed: false,
        },
      },
    });

    expect(state.form.isAddressSealed).toBeTruthy();
  });

  it('throws an error when contactToSeal is undefined', async () => {
    await expect(
      runAction(sealAddressAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketNumber: mockDocketNumber,
          },
          contactToSeal: undefined,
        },
      }),
    ).rejects.toThrow('Contact to seal is required');
  });
});
