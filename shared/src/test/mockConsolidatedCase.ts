/* eslint-disable max-lines */
export const MOCK_CONSOLIDATED_CASE: RawCase = {
  archivedCorrespondences: [],
  archivedDocketEntries: [],
  associatedJudge: 'Colvin',
  automaticBlocked: false,
  canAllowDocumentService: true,
  canAllowPrintableDocketRecord: true,
  caseCaption: 'Dacey Cox, Petitioner',
  caseStatusHistory: [
    {
      changedBy: 'Test Petitionsclerk',
      date: '2023-04-03T15:47:49.664Z',
      updatedCaseStatus: 'New',
    },
    {
      changedBy: 'System',
      date: '2023-04-03T15:52:59.423Z',
      updatedCaseStatus: 'General Docket - Not at Issue',
    },
    {
      changedBy: 'Test Docketclerk',
      date: '2023-04-03T15:54:48.112Z',
      updatedCaseStatus: 'General Docket - At Issue (Ready for Trial)',
    },
    {
      changedBy: 'System',
      date: '2023-09-11T18:44:40.926Z',
      updatedCaseStatus: 'Calendared',
    },
  ],
  caseType: 'CDP (Lien/Levy)',
  consolidatedCases: [
    {
      caseCaption: 'Dacey Cox, Petitioner',
      docketNumber: '102-67',
      docketNumberWithSuffix: '102-67L',
      entityName: 'Case',
      irsPractitioners: [
        {
          barNumber: 'RT6789',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            countryType: 'domestic',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'irspractitioner@example.com',
          entityName: 'IrsPractitioner',
          gsi1pk: 'leadCase|102-67',
          name: 'Test IRS Practitioner',
          pk: 'case|102-67',
          role: 'irsPractitioner',
          section: 'irsPractitioner',
          serviceIndicator: 'Electronic',
          sk: 'irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isSealed: false,
      leadDocketNumber: '102-67',
      petitioners: [
        {
          address1: '46 Fabien Court',
          address2: 'Sed quia quidem volu',
          address3: 'Unde impedit omnis',
          city: 'Ratione optio error',
          contactId: '5da54af1-1969-4011-8275-a949084b7928',
          contactType: 'petitioner',
          countryType: 'domestic',
          entityName: 'Petitioner',
          isAddressSealed: false,
          name: 'Dacey Cox',
          paperPetitionEmail: 'gacugowy@mailinator.com',
          phone: '+1 (673) 134-1903',
          postalCode: '55357',
          sealedAndUnavailable: false,
          serviceIndicator: 'None',
          state: 'NM',
        },
      ],
      privatePractitioners: [
        {
          barNumber: 'PT1234',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            countryType: 'domestic',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'privatepractitioner@example.com',
          entityName: 'PrivatePractitioner',
          firmName: 'GW Law Offices',
          gsi1pk: 'leadCase|102-67',
          name: 'Test Private Practitioner',
          pk: 'case|102-67',
          representing: ['5da54af1-1969-4011-8275-a949084b7928'],
          role: 'privatePractitioner',
          section: 'privatePractitioner',
          serviceIndicator: 'Electronic',
          sk: 'privatePractitioner|9805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      sortableDocketNumber: 2023000102,
      status: 'Calendared',
    },
    {
      caseCaption: 'Britanney Wiley, Petitioner',
      docketNumber: '103-67',
      docketNumberWithSuffix: '103-67L',
      entityName: 'Case',
      irsPractitioners: [
        {
          barNumber: 'RT6789',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            countryType: 'domestic',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'irspractitioner@example.com',
          entityName: 'IrsPractitioner',
          gsi1pk: 'leadCase|102-67',
          name: 'Test IRS Practitioner',
          pk: 'case|103-67',
          role: 'irsPractitioner',
          section: 'irsPractitioner',
          serviceIndicator: 'Electronic',
          sk: 'irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isSealed: false,
      leadDocketNumber: '102-67',
      petitioners: [
        {
          additionalName: 'c/o Fuga Repudiandae no',
          address1: '31 Oak Freeway',
          address2: 'Amet temporibus aut',
          address3: 'Cum nesciunt minima',
          city: 'Rem laborum debitis',
          contactId: '93dc623e-6ba3-487b-a336-c2fe18db8188',
          contactType: 'petitioner',
          countryType: 'domestic',
          entityName: 'Petitioner',
          hasConsentedToEService: true,
          isAddressSealed: false,
          name: 'Britanney Wiley',
          paperPetitionEmail: 'xufuqulex@mailinator.com',
          phone: '+1 (195) 385-5154',
          postalCode: '44692',
          sealedAndUnavailable: false,
          serviceIndicator: 'Paper',
          state: 'AR',
        },
        {
          address1: '68 Fabien Freeway',
          address2: 'Suscipit animi solu',
          address3: 'Architecto assumenda',
          city: 'Aspernatur nostrum s',
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: 'primary',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          entityName: 'Petitioner',
          isAddressSealed: false,
          name: 'Brett Osborne',
          phone: '+1 (537) 235-6147',
          postalCode: '89499',
          sealedAndUnavailable: false,
          serviceIndicator: 'Electronic',
          state: 'AK',
        },
      ],
      privatePractitioners: [],
      sortableDocketNumber: 2023000103,
      status: 'General Docket - At Issue (Ready for Trial)',
    },
    {
      caseCaption:
        'Cassidy Mejia & juvek@mailinator.com, Deceased, Cassidy Mejia, Surviving Spouse, Petitioners',
      docketNumber: '104-67',
      docketNumberWithSuffix: '104-67L',
      entityName: 'Case',
      irsPractitioners: [
        {
          barNumber: 'RT6789',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            countryType: 'domestic',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'irspractitioner@example.com',
          entityName: 'IrsPractitioner',
          gsi1pk: 'leadCase|102-67',
          name: 'Test IRS Practitioner',
          pk: 'case|104-67',
          role: 'irsPractitioner',
          section: 'irsPractitioner',
          serviceIndicator: 'Electronic',
          sk: 'irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isSealed: false,
      leadDocketNumber: '102-67',
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
        {
          address1: '829 Cowley Extension',
          address2: 'Consequuntur iusto o',
          address3: 'Quasi ullamco minus',
          city: 'Voluptate ad pariatu',
          contactId: '0e7e0136-7bed-4008-b7cc-d41b4c2d5b90',
          contactType: 'petitioner',
          countryType: 'domestic',
          entityName: 'Petitioner',
          inCareOf: 'juvek@mailinator.com',
          isAddressSealed: false,
          name: 'juvek@mailinator.com',
          paperPetitionEmail: 'juvek@mailinator.com',
          phone: '+1 (511) 719-8083',
          postalCode: '58386',
          sealedAndUnavailable: false,
          serviceIndicator: 'Paper',
          state: 'WI',
        },
      ],
      privatePractitioners: [],
      sortableDocketNumber: 2023000104,
      status: 'General Docket - At Issue (Ready for Trial)',
    },
    {
      caseCaption:
        'Magee Schmidt, Deceased, Magee Schmidt, Surviving Spouse, Petitioner',
      docketNumber: '105-67',
      docketNumberWithSuffix: '105-67L',
      entityName: 'Case',
      irsPractitioners: [
        {
          barNumber: 'RT6789',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            countryType: 'domestic',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'irspractitioner@example.com',
          entityName: 'IrsPractitioner',
          gsi1pk: 'leadCase|102-67',
          name: 'Test IRS Practitioner',
          pk: 'case|105-67',
          role: 'irsPractitioner',
          section: 'irsPractitioner',
          serviceIndicator: 'Electronic',
          sk: 'irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isSealed: false,
      leadDocketNumber: '102-67',
      petitioners: [
        {
          additionalName: 'Magee Schmidt',
          address1: '463 Clarendon Parkway',
          address2: 'Animi est sint sit',
          address3: 'Sint harum est omni',
          city: 'Autem earum dolor do',
          contactId: 'bc936c44-ff22-478b-a9e9-971f250d599c',
          contactType: 'petitioner',
          countryType: 'domestic',
          entityName: 'Petitioner',
          hasConsentedToEService: true,
          isAddressSealed: false,
          name: 'Magee Schmidt',
          paperPetitionEmail: 'petitioner1@example.com',
          phone: '+1 (477) 509-4351',
          postalCode: '45089',
          sealedAndUnavailable: false,
          serviceIndicator: 'None',
          state: 'FM',
        },
      ],
      privatePractitioners: [
        {
          barNumber: 'PT1234',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            countryType: 'domestic',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'privatepractitioner@example.com',
          entityName: 'PrivatePractitioner',
          firmName: 'GW Law Offices',
          gsi1pk: 'leadCase|102-67',
          name: 'Test Private Practitioner',
          pk: 'case|105-67',
          representing: ['bc936c44-ff22-478b-a9e9-971f250d599c'],
          role: 'privatePractitioner',
          section: 'privatePractitioner',
          serviceIndicator: 'Electronic',
          sk: 'privatePractitioner|9805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      sortableDocketNumber: 2023000105,
      status: 'General Docket - At Issue (Ready for Trial)',
    },
  ],
  correspondence: [],
  createdAt: '2023-04-03T15:47:49.663Z',
  docketEntries: [
    {
      addToCoversheet: false,
      createdAt: '2023-04-01T04:00:00.000Z',
      docketEntryId: '58c73359-3f04-4912-bd18-5d8b6cd49690',
      docketNumber: '102-67',
      documentTitle: 'Request for Place of Trial at Anchorage, Alaska',
      documentType: 'Request for Place of Trial',
      draftOrderState: null,
      entityName: 'DocketEntry',
      eventCode: 'RQT',
      filedBy: 'Petr. Dacey Cox',
      filedByRole: 'petitioner',
      filers: ['5da54af1-1969-4011-8275-a949084b7928'],
      filingDate: '2023-04-01T04:00:00.000Z',
      index: 2,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      isPaper: true,
      isStricken: false,
      mailingDate: '04/01/2023',
      numberOfPages: 2,
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2023-04-01T04:00:00.000Z',
      servedAt: '2023-04-03T15:52:59.426Z',
      servedParties: [
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      servedPartiesCode: 'R',
      stampData: {},
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      addToCoversheet: false,
      createdAt: '2023-04-01T04:00:00.000Z',
      docketEntryId: '8738fa09-bb16-43e0-a9c5-f528751bbd11',
      docketNumber: '102-67',
      documentTitle: 'Petition',
      documentType: 'Petition',
      draftOrderState: null,
      entityName: 'DocketEntry',
      eventCode: 'P',
      filedBy: 'Petr. Dacey Cox',
      filedByRole: 'petitioner',
      filers: ['5da54af1-1969-4011-8275-a949084b7928'],
      filingDate: '2023-04-01T04:00:00.000Z',
      index: 1,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      isPaper: true,
      isStricken: false,
      mailingDate: '04/01/2023',
      numberOfPages: 2,
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2023-04-01T04:00:00.000Z',
      servedAt: '2023-04-03T15:52:59.423Z',
      servedParties: [
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      servedPartiesCode: 'R',
      stampData: {},
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      workItem: {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        associatedJudge: 'Colvin',
        caseIsInProgress: true,
        caseStatus: 'Calendared',
        caseTitle: 'Dacey Cox',
        completedAt: '2023-04-03T15:52:59.441Z',
        completedBy: 'Test Petitionsclerk',
        completedByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        completedMessage: 'Served to IRS',
        createdAt: '2023-04-03T15:47:49.664Z',
        docketEntry: {
          createdAt: '2023-04-01T04:00:00.000Z',
          docketEntryId: '8738fa09-bb16-43e0-a9c5-f528751bbd11',
          documentTitle: 'Petition',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Petr. Dacey Cox',
          isFileAttached: true,
          isPaper: true,
          receivedAt: '2023-04-01T04:00:00.000Z',
          servedAt: '2023-04-03T15:52:59.423Z',
          userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber: '102-67',
        docketNumberWithSuffix: '102-67L',
        entityName: 'WorkItem',
        highPriority: true,
        isInitializeCase: true,
        leadDocketNumber: '102-67',
        section: 'petitions',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        trialDate: '2020-11-25T05:00:00.000Z',
        trialLocation: 'Standalone Remote',
        updatedAt: '2023-04-03T15:47:49.665Z',
        workItemId: 'a181ca02-fa09-44d6-a25b-1ea6e9015f89',
      },
    },
    {
      addToCoversheet: false,
      createdAt: '2023-04-03T15:52:59.427Z',
      docketEntryId: 'f724b153-8ae8-4463-9eaa-f14789de1c7f',
      docketNumber: '102-67',
      documentTitle: 'Filing Fee Paid',
      documentType: 'Filing Fee Paid',
      entityName: 'DocketEntry',
      eventCode: 'FEE',
      filedByRole: 'System',
      filers: [],
      filingDate: '2023-04-01T04:00:00.000Z',
      index: 3,
      isDraft: false,
      isFileAttached: false,
      isOnDocketRecord: true,
      isStricken: false,
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2023-04-03T04:00:00.000Z',
      stampData: {},
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      addToCoversheet: false,
      createdAt: '2023-04-03T15:53:02.251Z',
      docketEntryId: 'ee0c823f-8b75-4e41-82f4-ae4270fa3095',
      docketNumber: '102-67',
      documentTitle: 'Notice of Receipt of Petition',
      documentType: 'Notice of Receipt of Petition',
      draftOrderState: null,
      entityName: 'DocketEntry',
      eventCode: 'NOTR',
      filedByRole: 'System',
      filers: [],
      filingDate: '2023-04-03T15:53:02.251Z',
      index: 4,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      isStricken: false,
      numberOfPages: 1,
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2023-04-03T04:00:00.000Z',
      servedAt: '2023-04-03T15:53:02.251Z',
      servedParties: [
        {
          name: 'Dacey Cox',
        },
      ],
      servedPartiesCode: 'P',
      stampData: {},
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      addToCoversheet: false,
      attachments: false,
      certificateOfService: false,
      certificateOfServiceDate: null,
      createdAt: '2023-08-08T17:32:21.432Z',
      docketEntryId: '10af43a5-b29b-4ab6-9924-545598fd12c8',
      docketNumber: '102-67',
      documentTitle: 'Seriatim Answering Brief',
      documentType: 'Seriatim Answering Brief',
      draftOrderState: null,
      entityName: 'DocketEntry',
      eventCode: 'SEAB',
      filedBy: 'Resp.',
      filedByRole: 'irsPractitioner',
      filers: [],
      filingDate: '2023-08-08T17:32:21.432Z',
      hasSupportingDocuments: false,
      index: 5,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      isStricken: false,
      numberOfPages: 2,
      partyIrsPractitioner: true,
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2023-08-08T04:00:00.000Z',
      redactionAcknowledgement: true,
      relationship: 'primaryDocument',
      scenario: 'Standard',
      servedAt: '2023-08-08T17:32:21.434Z',
      servedParties: [
        {
          email: 'privatepractitioner@example.com',
          name: 'Test Private Practitioner',
        },
      ],
      servedPartiesCode: 'B',
      stampData: {},
      userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
      workItem: {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: 'Colvin',
        caseStatus: 'Calendared',
        caseTitle: 'Dacey Cox',
        createdAt: '2023-08-08T17:32:21.433Z',
        docketEntry: {
          createdAt: '2023-08-08T17:32:21.432Z',
          docketEntryId: '10af43a5-b29b-4ab6-9924-545598fd12c8',
          documentTitle: 'Seriatim Answering Brief',
          documentType: 'Seriatim Answering Brief',
          eventCode: 'SEAB',
          filedBy: 'Resp.',
          isFileAttached: true,
          receivedAt: '2023-08-08T04:00:00.000Z',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber: '102-67',
        docketNumberWithSuffix: '102-67L',
        entityName: 'WorkItem',
        highPriority: true,
        leadDocketNumber: '102-67',
        section: 'docket',
        sentBy: 'Test IRS Practitioner',
        sentByUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        trialDate: '2020-11-25T05:00:00.000Z',
        trialLocation: 'Standalone Remote',
        updatedAt: '2023-08-08T17:32:21.433Z',
        workItemId: 'abc6cb32-97b7-4ddc-871b-eb41aaa45114',
      },
    },
    {
      addToCoversheet: false,
      createdAt: '2023-08-15T16:47:51.688Z',
      date: null,
      docketEntryId: 'c7ea55fe-1716-47bb-b2c5-8112fea11d14',
      docketNumber: '102-67',
      documentContentsId: '20cdeb6a-5f13-48b0-b433-8c0b36be5eb1',
      documentTitle: 'Standing Pretrial Order',
      documentType: 'Standing Pretrial Order',
      draftOrderState: null,
      editState:
        '{"freeText":"test","date":null,"documentType":"Standing Pretrial Order","documentTitle":"Standing Pretrial Order","generatedDocumentTitle":"Standing Pretrial Order","eventCode":"SPTO","scenario":"Type B","docketEntryId":"c7ea55fe-1716-47bb-b2c5-8112fea11d14","docketNumber":"102-67"}',
      entityName: 'DocketEntry',
      eventCode: 'SPTO',
      filedByRole: 'docketclerk',
      filers: [],
      filingDate: '2023-08-15T16:48:20.679Z',
      freeText: 'test',
      index: 6,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      isPendingService: false,
      isStricken: false,
      numberOfPages: 2,
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2023-08-15T04:00:00.000Z',
      relationship: 'primaryDocument',
      scenario: 'Type B',
      servedAt: '2023-08-15T16:48:20.679Z',
      servedParties: [
        {
          email: 'privatepractitioner@example.com',
          name: 'Test Private Practitioner',
        },
        {
          email: 'irspractitioner@example.com',
          name: 'Test IRS Practitioner',
        },
      ],
      servedPartiesCode: 'B',
      stampData: {},
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '102-67',
  docketNumberSuffix: 'L',
  docketNumberWithSuffix: '102-67L',
  entityName: 'Case',
  hasPendingItems: false,
  hasVerifiedIrsNotice: false,
  hearings: [],
  initialCaption: 'Dacey Cox, Petitioner',
  initialDocketNumberSuffix: 'L',
  irsPractitioners: [
    {
      barNumber: 'RT6789',
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email: 'irspractitioner@example.com',
      entityName: 'IrsPractitioner',
      name: 'Test IRS Practitioner',
      role: 'irsPractitioner',
      section: 'irsPractitioner',
      serviceIndicator: 'Electronic',
      userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  isPaper: true,
  isSealed: false,
  leadDocketNumber: '102-67',
  mailingDate: '04/01/2023',
  noticeOfAttachments: false,
  orderDesignatingPlaceOfTrial: false,
  orderForAmendedPetition: false,
  orderForAmendedPetitionAndFilingFee: false,
  orderForCds: false,
  orderForFilingFee: false,
  orderForRatification: false,
  orderToShowCause: false,
  partyType: 'Petitioner',
  petitionPaymentDate: '2023-04-01T04:00:00.000Z',
  petitionPaymentMethod: 'cod',
  petitionPaymentStatus: 'Paid',
  petitioners: [
    {
      address1: '46 Fabien Court',
      address2: 'Sed quia quidem volu',
      address3: 'Unde impedit omnis',
      city: 'Ratione optio error',
      contactId: '5da54af1-1969-4011-8275-a949084b7928',
      contactType: 'petitioner',
      countryType: 'domestic',
      entityName: 'Petitioner',
      isAddressSealed: false,
      name: 'Dacey Cox',
      paperPetitionEmail: 'gacugowy@mailinator.com',
      phone: '+1 (673) 134-1903',
      postalCode: '55357',
      sealedAndUnavailable: false,
      serviceIndicator: 'None',
      state: 'NM',
    },
  ],
  preferredTrialCity: 'Anchorage, Alaska',
  privatePractitioners: [
    {
      barNumber: 'PT1234',
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email: 'privatepractitioner@example.com',
      entityName: 'PrivatePractitioner',
      firmName: 'GW Law Offices',
      name: 'Test Private Practitioner',
      representing: ['5da54af1-1969-4011-8275-a949084b7928'],
      role: 'privatePractitioner',
      section: 'privatePractitioner',
      serviceIndicator: 'Electronic',
      userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  procedureType: 'Regular',
  qcCompleteForTrial: {},
  receivedAt: '2023-04-01T04:00:00.000Z',
  sortableDocketNumber: 2023000102,
  statistics: [],
  status: 'Calendared',
  trialDate: '2020-11-25T05:00:00.000Z',
  trialLocation: 'Standalone Remote',
  trialSessionId: '111ac21b-99f9-4321-98c8-b95db00af96b',
  trialTime: '13:00',
};
