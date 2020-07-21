const {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../entities/EntityConstants');
const {
  fileExternalDocumentInteractor,
} = require('../useCases/externalDocument/fileExternalDocumentInteractor');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

describe('fileExternalDocumentInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';

  beforeEach(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('should attach the expected documents to the case', async () => {
    const { caseId, docketNumber } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseCaption: 'Caption',
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AL',
        },
        contactSecondary: {},
        docketRecord: [
          {
            description: 'first record',
            documentId: '8675309b-18d0-43ec-bafb-654e83405411',
            eventCode: 'P',
            filingDate: '2018-03-01T00:01:00.000Z',
            index: 1,
          },
        ],
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: [
        '12de0fac-f63c-464f-ac71-0f54fd248484',
        '22de0fac-f63c-464f-ac71-0f54fd248484',
        '32de0fac-f63c-464f-ac71-0f54fd248484',
        '42de0fac-f63c-464f-ac71-0f54fd248484',
      ],
      documentMetadata: {
        attachments: false,
        caseId,
        certificateOfService: false,
        certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
        docketNumber: '201-19',
        documentTitle: 'Motion for Leave to File Brief in Support of Petition',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        hasSupportingDocuments: true,
        partyPrimary: true,
        scenario: 'Nonstandard H',
        secondaryDocument: {
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          eventCode: 'BRF',
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
        },
        secondarySupportingDocuments: [
          {
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            eventCode: 'BRF',
            previousDocument: {
              documentTitle: 'Amended Answer',
              documentType: 'Amended',
            },
            scenario: 'Nonstandard A',
          },
        ],
        supportingDocument: 'Brief in Support',
        supportingDocuments: [
          {
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            eventCode: 'BRF',
            previousDocument: {
              documentTitle: 'Amended Answer',
              documentType: 'Amended',
            },
            scenario: 'Nonstandard A',
          },
        ],
      },
    });

    const caseAfterDocument = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(caseAfterDocument).toMatchObject({
      caseCaption: 'Test Petitioner, Petitioner',
      caseId,
      caseType: 'Innocent Spouse',
      contactPrimary: {
        address1: '19 First Freeway',
        address2: 'Ad cumque quidem lau',
        address3: 'Anim est dolor animi',
        city: 'Rerum eaque cupidata',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '+1 (599) 681-5435',
        postalCode: '89614',
        state: 'AL',
      },
      contactSecondary: {},
      docketNumber: '101-19',
      docketNumberSuffix: 'S',
      docketRecord: [
        {
          description: 'Petition',
          documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          filedBy: 'Petr. Test Petitioner',
        },
        {
          description: 'Request for Place of Trial at Aberdeen, South Dakota',
        },
        {
          description: 'Motion for Leave to File Brief in Support of Petition',
          documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
        },
        {
          description: 'Brief in Support of Amended Answer',
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
        },
        {
          description: 'Brief in Support of Petition',
          documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
        },
        {
          description: 'Brief in Support of Amended Answer',
          documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
        },
      ],
      documents: [
        {
          documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          documentType: 'Petition',
          filedBy: 'Petr. Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19S',
              document: {
                documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
                documentType: 'Petition',
                filedBy: 'Petr. Test Petitioner',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              },
              isInitializeCase: true,
              messages: [
                {
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Test Petitioner is ready for review.',
                },
              ],
              section: 'petitions',
              sentBy: 'Test Petitioner',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
        {
          documentId: '72de0fac-f63c-464f-ac71-0f54fd248484',
          documentType: 'Statement of Taxpayer Identification',
          filedBy: 'Petr. Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        {
          attachments: false,
          certificateOfService: false,
          docketNumber: '201-19',
          documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle:
            'Motion for Leave to File Brief in Support of Petition',
          documentType: 'Motion for Leave to File',
          filedBy: 'Petr. Test Petitioner',
          hasSupportingDocuments: true,
          partyPrimary: true,
          scenario: 'Nonstandard H',
          supportingDocument: 'Brief in Support',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19S',
              document: {
                attachments: false,
                certificateOfService: false,
                certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
                docketNumber: '201-19',
                documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle:
                  'Motion for Leave to File Brief in Support of Petition',
                documentType: 'Motion for Leave to File',
                hasSupportingDocuments: true,
                partyPrimary: true,
                scenario: 'Nonstandard H',
                supportingDocument: 'Brief in Support',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              },
              messages: [
                {
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Motion for Leave to File filed by Petitioner is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'Test Petitioner',
            },
          ],
        },
        {
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19S',
              document: {
                documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Amended Answer',
                documentType: 'Brief in Support',
                partyPrimary: true,
                previousDocument: {
                  documentTitle: 'Amended Answer',
                  documentType: 'Amended',
                },
                scenario: 'Nonstandard A',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              },
              messages: [
                {
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Brief in Support filed by Petitioner is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'Test Petitioner',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
        {
          documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19S',
              document: {
                documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Petition',
                documentType: 'Brief in Support',
                lodged: true,
                partyPrimary: true,
                previousDocument: { documentType: 'Petition' },
                scenario: 'Nonstandard A',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              },
              messages: [
                {
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Brief in Support filed by Petitioner is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'Test Petitioner',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
        {
          documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19S',
              document: {
                documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Amended Answer',
                documentType: 'Brief in Support',
                lodged: true,
                partyPrimary: true,
                previousDocument: {
                  documentTitle: 'Amended Answer',
                  documentType: 'Amended',
                },
                scenario: 'Nonstandard A',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              },
              messages: [
                {
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Brief in Support filed by Petitioner is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'Test Petitioner',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
      ],
      filingType: 'Myself',
      initialCaption: 'Test Petitioner, Petitioner',
      initialDocketNumberSuffix: 'S',
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Aberdeen, South Dakota',
      privatePractitioners: [],
      procedureType: 'Small',
      status: CASE_STATUS_TYPES.new,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Docketclerk',
        role: ROLES.docketClerk,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const workItems = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(workItems.length).toEqual(4);

    expect(workItems).toMatchObject([
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
        document: {
          attachments: false,
          certificateOfService: false,
          docketNumber: '201-19',
          documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle:
            'Motion for Leave to File Brief in Support of Petition',
          documentType: 'Motion for Leave to File',
          hasSupportingDocuments: true,
          partyPrimary: true,
          scenario: 'Nonstandard H',
          supportingDocument: 'Brief in Support',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        messages: [
          {
            from: 'Test Petitioner',
            fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Motion for Leave to File filed by Petitioner is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'Test Petitioner',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
        document: {
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        messages: [
          {
            from: 'Test Petitioner',
            fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Brief in Support filed by Petitioner is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'Test Petitioner',
        updatedAt: '2019-03-01T22:54:06.000Z',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
        document: {
          documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        messages: [
          {
            from: 'Test Petitioner',
            fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Brief in Support filed by Petitioner is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'Test Petitioner',
        updatedAt: '2019-03-01T22:54:06.000Z',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
        document: {
          documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        messages: [
          {
            from: 'Test Petitioner',
            fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Brief in Support filed by Petitioner is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'Test Petitioner',
      },
    ]);
  });

  it('should set partyPrimary to representingPrimary when partyPrimary is not provided', async () => {
    const { caseId, docketNumber } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseCaption: 'Caption',
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AL',
        },
        contactSecondary: {},
        docketRecord: [
          {
            description: 'first record',
            documentId: '8675309b-18d0-43ec-bafb-654e83405411',
            eventCode: 'P',
            filingDate: '2018-03-01T00:01:00.000Z',
            index: 1,
          },
        ],
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: [
        '12de0fac-f63c-464f-ac71-0f54fd248484',
        '22de0fac-f63c-464f-ac71-0f54fd248484',
        '32de0fac-f63c-464f-ac71-0f54fd248484',
        '42de0fac-f63c-464f-ac71-0f54fd248484',
      ],
      documentMetadata: {
        attachments: false,
        caseId,
        certificateOfService: false,
        certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
        docketNumber: '201-19',
        documentTitle: 'Motion for Leave to File Brief in Support of Petition',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        hasSupportingDocuments: true,
        representingPrimary: true,
        scenario: 'Nonstandard H',
        secondaryDocument: {
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          eventCode: 'BRF',
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
        },
        secondarySupportingDocuments: [
          {
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            eventCode: 'BRF',
            previousDocument: {
              documentTitle: 'Amended Answer',
              documentType: 'Amended',
            },
            scenario: 'Nonstandard A',
          },
        ],
        supportingDocument: 'Brief in Support',
        supportingDocuments: [
          {
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            eventCode: 'BRF',
            previousDocument: {
              documentTitle: 'Amended Answer',
              documentType: 'Amended',
            },
            scenario: 'Nonstandard A',
          },
        ],
      },
    });

    const caseAfterDocument = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });
    const filedDocument = caseAfterDocument.documents.find(
      d => d.documentType === 'Motion for Leave to File',
    );
    expect(filedDocument).toMatchObject({
      filedBy: 'Petr. Test Petitioner',
    });
  });
});
