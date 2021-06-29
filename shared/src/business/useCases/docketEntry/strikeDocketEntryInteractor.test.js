import { strikeDocketEntryInteractor } from './strikeDocketEntryInteractor';
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');

describe('strikeDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();

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
          name: 'Guy Fieri',
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

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      strikeDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the docket record is not found on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      strikeDocketEntryInteractor(applicationContext, {
        docketEntryId: 'does-not-exist',
        docketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should call getCaseByDocketNumber, getUserById, and updateDocketEntry', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await strikeDocketEntryInteractor(applicationContext, {
      docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
      docketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry.mock
        .calls[0][0].document,
    ).toMatchObject({ strickenAt: expect.anything() });
  });

  it('should throw an error if the document is not on the docket record', async () => {
    caseRecord.docketEntries[0].isOnDocketRecord = false;

    await expect(
      strikeDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow(
      'Cannot strike a document that is not on the docket record.',
    );
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).not.toHaveBeenCalled();
  });
});
