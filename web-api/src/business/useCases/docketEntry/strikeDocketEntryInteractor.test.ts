import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
jest.mock('@web-api/persistence/postgres/users/getUserById');
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { strikeDocketEntryInteractor } from './strikeDocketEntryInteractor';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('strikeDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getUserById = jest.mocked(getUserByIdMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '45678-18',
          documentTitle: 'first record',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          index: 1,
          isOnDocketRecord: true,
          userId: mockUserId,
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Roslindis Angelino',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '8100e22a-c7f2-4574-b4f6-eb092fca9f35',
    };

    getUserById.mockResolvedValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      role: 'admin',
    } as DbUser);

    getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error when not authorized', async () => {
    await expect(
      strikeDocketEntryInteractor(
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: caseRecord.docketNumber,
        },
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket record is not found on the case', async () => {
    await expect(
      strikeDocketEntryInteractor(
        {
          docketEntryId: 'does-not-exist',
          docketNumber: caseRecord.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should call getCaseByDocketNumber, getUserById, and upsertDocketEntries', async () => {
    const docketNumberId = '8675309b-18d0-43ec-bafb-654e83405411';
    await strikeDocketEntryInteractor(
      {
        docketEntryId: docketNumberId,
        docketNumber: caseRecord.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(getUserById).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();

    const [{ caseToUpdate }] = updateCaseAndAssociations.mock.calls[0];
    const docketEntry = caseToUpdate.getDocketEntryById({
      docketEntryId: docketNumberId,
    });
    expect(docketEntry).toMatchObject({
      strickenAt: expect.anything(),
    });
  });

  it('should throw an error when the document is not on the docket record', async () => {
    caseRecord.docketEntries[0].isOnDocketRecord = false;

    await expect(
      strikeDocketEntryInteractor(
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: caseRecord.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      'Cannot strike a document that is not on the docket record.',
    );
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
  });
});
