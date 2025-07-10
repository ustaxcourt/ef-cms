jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { getOtherFilers } from '@shared/business/entities/cases/Case';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { sealCaseContactAddressInteractor } from './sealCaseContactAddressInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('sealCaseContactAddressInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should throw an error if the user is unauthorized to seal a case contact address', async () => {
    await expect(
      sealCaseContactAddressInteractor(
        applicationContext,
        {
          contactId: '10aa100f-0330-442b-8423-b01690c76e3f',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for sealing case contact addresses');
  });

  it('should throw an error if the contactId is not found on the case', async () => {
    await expect(
      sealCaseContactAddressInteractor(
        applicationContext,
        {
          contactId: '23-skidoo',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Cannot seal contact');
  });

  it('should throw an exception of `Cannot seal contact` even when otherFilers or otherPetitioners are undefined or null', async () => {
    const caseWithoutOthers = {
      ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      caption: MOCK_CASE_WITH_SECONDARY_OTHERS.caseCaption,
      otherFilers: null,
      otherPetitioners: null,
    };

    getCaseByDocketNumber.mockResolvedValue(caseWithoutOthers);

    await expect(
      sealCaseContactAddressInteractor(
        applicationContext,
        {
          contactId: '23-skidoo',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Cannot seal contact');
  });

  it('should call updateCase with `isSealedAddress` on contactPrimary and return the updated case', async () => {
    const result = await sealCaseContactAddressInteractor(
      applicationContext,
      {
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416', // contactPrimary
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.petitioners[0].isAddressSealed).toBe(true);
  });

  it('should call updateCase with `isSealedAddress` on contactSecondary and return the updated case', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE_WITH_SECONDARY_OTHERS);

    const result = await sealCaseContactAddressInteractor(
      applicationContext,
      {
        contactId: '2226050f-a423-47bb-943b-a5661fe08a6b', // contactSecondary
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.petitioners[5].isAddressSealed).toBe(true);
  });

  it('should call updateCase with `isSealedAddress` on otherFilers[1] and return the updated case', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE_WITH_SECONDARY_OTHERS);

    const result = await sealCaseContactAddressInteractor(
      applicationContext,
      {
        contactId: '4446050f-a423-47bb-943b-a5661fe08a6b', // otherFilers[1]
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(getOtherFilers(result)[1].isAddressSealed).toBe(true);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      sealCaseContactAddressInteractor(
        applicationContext,
        {
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416', // contactPrimary
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await sealCaseContactAddressInteractor(
      applicationContext,
      {
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416', // contactPrimary
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
