import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { sealAddressAction } from './sealAddressAction';

describe('sealAddressAction', () => {
  const caseDetail = { docketNumber: '123-20' };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .sealCaseContactAddressInteractor.mockReturnValue(caseDetail);
  });

  it('makes a call to seal the case contact using state.contactId and returns the updated case detail and success message', async () => {
    const mockContactId = '123456';
    const mockDocketNumber = '999-99';
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
        .calls[0][0],
    ).toMatchObject({
      contactId: mockContactId,
      docketNumber: mockDocketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Address sealed for Bob Barker.' },
      caseDetail,
    });
  });
});
