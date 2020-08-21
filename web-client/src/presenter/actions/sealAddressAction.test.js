import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { sealAddressAction } from './sealAddressAction';

describe('sealAddressAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('makes a call to seal the case contact using state.contactId', async () => {
    const mockContactId = '123456';
    const mockDocketNumber = '999-99';
    await runAction(sealAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        contactToSeal: {
          contactId: mockContactId,
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
  });
});
