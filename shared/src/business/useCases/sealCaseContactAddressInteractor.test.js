const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const {
  sealCaseContactAddressInteractor,
} = require('./sealCaseContactAddressInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ROLES } = require('../entities/EntityConstants');

describe('sealCaseContactAddressInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error if the user is unauthorized to seal a case contact address', async () => {
    await expect(
      sealCaseContactAddressInteractor({
        applicationContext,
        contactId: '10aa100f-0330-442b-8423-b01690c76e3f',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for sealing case contact addresses');
  });

  it('should throw an error if the contactId is not found on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });
    await expect(
      sealCaseContactAddressInteractor({
        applicationContext,
        contactId: '23-skidoo',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Cannot seal contact');
  });

  it('should call updateCase with `isSealedAddress` on contactPrimary and return the updated case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await sealCaseContactAddressInteractor({
      applicationContext,
      contactId: '76a6050f-a423-47bb-943b-a5661fe08a6b', // contactPrimary
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();

    expect(result.contactPrimary.isAddressSealed).toBe(true);
  });

  it('should call updateCase with `isSealedAddress` on contactSecondary and otherFilers[1] and return the updated case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE_WITH_SECONDARY_OTHERS);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await sealCaseContactAddressInteractor({
      applicationContext,
      contactId: '2226050f-a423-47bb-943b-a5661fe08a6b', // contactSecondary
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();

    expect(result.contactSecondary.isAddressSealed).toBe(true);
  });

  it('should call updateCase with `isSealedAddress` on otherFilers[1] and return the updated case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE_WITH_SECONDARY_OTHERS);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });
    const result = await sealCaseContactAddressInteractor({
      applicationContext,
      contactId: '4446050f-a423-47bb-943b-a5661fe08a6b', // otherFilers[1]
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();

    expect(result.otherFilers[1].isAddressSealed).toBe(true);
  });
});
