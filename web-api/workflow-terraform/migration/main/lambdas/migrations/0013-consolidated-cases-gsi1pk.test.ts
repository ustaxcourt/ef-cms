import { CaseRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { createTestApplicationContext } from '@shared/business/test/createTestApplicationContext';
import { migrateItems } from './0013-consolidated-cases-gsi1pk';

describe('migrateItems', () => {
  const applicationContext = createTestApplicationContext({});
  const documentClient = applicationContext.getDocumentClient();
  const leadCaseRecord: CaseRecord = {
    associatedJudge: 'Chief Judge',
    automaticBlocked: true,
    automaticBlockedDate: '2023-08-08T17:32:21.475Z',
    automaticBlockedReason: 'Pending Item',
    caseCaption:
      'Cassidy Mejia & juvek@mailinator.com, Deceased, Cassidy Mejia, Surviving Spouse, Petitioners',
    caseType: 'CDP (Lien/Levy)',
    createdAt: '2023-04-03T15:50:59.961Z',
    docketNumber: '104-67',
    docketNumberSuffix: 'L',
    docketNumberWithSuffix: '104-67L',
    entityName: 'Case',
    gsi1pk: 'case|102-67',
    hasPendingItems: true,
    hasVerifiedIrsNotice: false,
    initialCaption:
      'Cassidy Mejia & juvek@mailinator.com, Deceased, Cassidy Mejia, Surviving Spouse, Petitioners',
    initialDocketNumberSuffix: 'SL',
    isPaper: true,
    isSealed: false,
    leadDocketNumber: '102-67',
    mailingDate: '03/18/2023',
    noticeOfAttachments: false,
    orderDesignatingPlaceOfTrial: false,
    orderForAmendedPetition: false,
    orderForAmendedPetitionAndFilingFee: false,
    orderForCds: false,
    orderForFilingFee: false,
    orderForRatification: false,
    orderToShowCause: false,
    partyType: 'Petitioner & deceased spouse',
    petitionPaymentStatus: 'Waived',
    petitionPaymentWaivedDate: '2023-03-18T04:00:00.000Z',
    petitioners: [
      {
        additionalName: 'c/o undefined',
        address1: '829 Cowley Extension',
        address2: 'Consequuntur iusto o',
        address3: 'Quasi ullamco minus',
        city: 'Voluptate ad pariatu',
        contactId: '2fbbbe4c-c675-4f16-a8ce-228ae572d2d9',
        contactType: 'petitioner',
        countryType: 'domestic',
        entityName: 'Petitioner',
        hasConsentedToEService: false,
        isAddressSealed: false,
        name: 'Cassidy Mejia',
        paperPetitionEmail: 'juvek@mailinator.com',
        phone: '+1 (511) 719-8083',
        postalCode: '58386',
        sealedAndUnavailable: false,
        serviceIndicator: 'Paper',
        state: 'WI',
      },
    ],
    pk: 'case|104-67',
    preferredTrialCity: 'Anchorage, Alaska',
    procedureType: 'Regular',
    receivedAt: '2023-03-18T04:00:00.000Z',
    sk: 'case|104-67',
    sortableDocketNumber: 2023000104,
    statistics: [],
    status: 'General Docket - At Issue (Ready for Trial)',
  };

  it('should update gsi1pk format on case records with a lead docket number', async () => {
    const items = [leadCaseRecord];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([{ ...items[0], gsi1pk: 'leadCase|102-67' }]);
  });

  it('should add gsi1pk on user practitioner records for consolidated cases', async () => {
    documentClient.get
      .mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: leadCaseRecord }),
      })
      .mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: leadCaseRecord }),
      });

    const items = [
      {
        pk: 'case|102-67',
        role: 'privatePractitioner',
        sk: 'privatePractitioner|abc123',
      },
      {
        pk: 'case|102-67',
        role: 'irsPractitioner',
        sk: 'irsPractitioner|jac111',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        gsi1pk: 'leadCase|102-67',
        pk: 'case|102-67',
        role: 'privatePractitioner',
        sk: 'privatePractitioner|abc123',
      },
      {
        gsi1pk: 'leadCase|102-67',
        pk: 'case|102-67',
        role: 'irsPractitioner',
        sk: 'irsPractitioner|jac111',
      },
    ]);
  });

  it('should NOT modify any records that are not case or case practitioner records on consolidated cases', async () => {
    const nonConsolidatedCaseRecord1 = {
      ...leadCaseRecord,
      docketNumber: '101-99',
      leadDocketNumber: undefined,
    };
    documentClient.get
      .mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: nonConsolidatedCaseRecord1 }),
      })
      .mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: nonConsolidatedCaseRecord1 }),
      });

    const items = [
      nonConsolidatedCaseRecord1,
      {
        pk: 'case|101-99',
        role: 'privatePractitioner',
        sk: 'privatePractitioner|piv111',
      },
      {
        pk: 'case|101-99',
        role: 'irsPractitioner',
        sk: 'irsPractitioner|jac111',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(items);
  });
});
