import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
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
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

describe('strikeDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);

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

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

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
    await strikeDocketEntryInteractor(
      {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketNumber: caseRecord.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalled();
    expect(upsertDocketEntries).toHaveBeenCalled();

    const [[docketEntry]] = upsertDocketEntries.mock.calls[0];
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
    expect(upsertDocketEntries).not.toHaveBeenCalled();
  });
});
