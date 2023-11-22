import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ROLES } from '../entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { getOtherFilers } from '../entities/cases/Case';
import { sealCaseContactAddressInteractor } from './sealCaseContactAddressInteractor';

describe('sealCaseContactAddressInteractor', () => {
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });
  });

  it('should throw an error if the user is unauthorized to seal a case contact address', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'docketClerk',
    });
    await expect(
      sealCaseContactAddressInteractor(applicationContext, {
        contactId: '10aa100f-0330-442b-8423-b01690c76e3f',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for sealing case contact addresses');
  });

  it('should throw an error if the contactId is not found on the case', async () => {
    await expect(
      sealCaseContactAddressInteractor(applicationContext, {
        contactId: '23-skidoo',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Cannot seal contact');
  });

  it('should throw an exception of `Cannot seal contact` even when otherFilers or otherPetitioners are undefined or null', async () => {
    const caseWithoutOthers = {
      ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      otherFilers: null,
      otherPetitioners: null,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseWithoutOthers);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    await expect(
      sealCaseContactAddressInteractor(applicationContext, {
        contactId: '23-skidoo',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Cannot seal contact');
  });

  it('should call updateCase with `isSealedAddress` on contactPrimary and return the updated case', async () => {
    const result = await sealCaseContactAddressInteractor(applicationContext, {
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416', // contactPrimary
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitioners[0].isAddressSealed).toBe(true);
  });

  it('should call updateCase with `isSealedAddress` on contactSecondary and return the updated case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE_WITH_SECONDARY_OTHERS);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await sealCaseContactAddressInteractor(applicationContext, {
      contactId: '2226050f-a423-47bb-943b-a5661fe08a6b', // contactSecondary
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitioners[5].isAddressSealed).toBe(true);
  });

  it('should call updateCase with `isSealedAddress` on otherFilers[1] and return the updated case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE_WITH_SECONDARY_OTHERS);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await sealCaseContactAddressInteractor(applicationContext, {
      contactId: '4446050f-a423-47bb-943b-a5661fe08a6b', // otherFilers[1]
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(getOtherFilers(result)[1].isAddressSealed).toBe(true);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      sealCaseContactAddressInteractor(applicationContext, {
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416', // contactPrimary
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await sealCaseContactAddressInteractor(applicationContext, {
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416', // contactPrimary
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
