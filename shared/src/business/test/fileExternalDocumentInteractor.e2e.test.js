const sinon = require('sinon');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  fileExternalDocumentInteractor,
} = require('../useCases/externalDocument/fileExternalDocumentInteractor');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';

describe('fileExternalDocumentInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(CREATED_DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Test Petitioner',
        role: User.ROLES.petitioner,
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should attach the expected documents to the case', async () => {
    const { caseId } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
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
        category: 'Motion',
        certificateOfService: false,
        certificateOfServiceDate: 'undefined-undefined-undefined',
        docketNumber: '201-19',
        documentTitle: 'Motion for Leave to File Brief in Support of Petition',
        documentType: 'Motion for Leave to File',
        hasSupportingDocuments: true,
        partyPrimary: true,
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Supporting Document',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          previousDocument: 'Petition',
          scenario: 'Nonstandard A',
        },
        secondarySupportingDocuments: [
          {
            category: 'Supporting Document',
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            previousDocument: 'Amended Answer',
            scenario: 'Nonstandard A',
          },
        ],
        supportingDocument: 'Brief in Support',
        supportingDocuments: [
          {
            category: 'Supporting Document',
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            previousDocument: 'Amended Answer',
            scenario: 'Nonstandard A',
          },
        ],
      },
    });

    const caseAfterDocument = await getCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(caseAfterDocument).toMatchObject({
      caseCaption: 'Test Petitioner, Petitioner',
      caseId,
      caseTitle:
        'Test Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      caseType: 'Innocent Spouse',
      contactPrimary: {
        address1: '19 First Freeway',
        address2: 'Ad cumque quidem lau',
        address3: 'Anim est dolor animi',
        city: 'Rerum eaque cupidata',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '+1 (599) 681-5435',
        postalCode: '89614',
        state: 'AP',
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
          caseId,
          documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          documentType: 'Petition',
          filedBy: 'Petr. Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: Case.STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
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
              sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
        {
          caseId,
          documentId: '72de0fac-f63c-464f-ac71-0f54fd248484',
          documentType: 'Statement of Taxpayer Identification',
          filedBy: 'Petr. Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        {
          attachments: false,
          caseId,
          category: 'Motion',
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
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: Case.STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                attachments: false,
                caseId,
                category: 'Motion',
                certificateOfService: false,
                certificateOfServiceDate: 'undefined-undefined-undefined',
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
              sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
        {
          caseId,
          category: 'Supporting Document',
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          partyPrimary: true,
          previousDocument: 'Amended Answer',
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: Case.STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                category: 'Supporting Document',
                documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Amended Answer',
                documentType: 'Brief in Support',
                partyPrimary: true,
                previousDocument: 'Amended Answer',
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
              sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
        {
          category: 'Supporting Document',
          documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: 'Petition',
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseStatus: Case.STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                category: 'Supporting Document',
                documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Petition',
                documentType: 'Brief in Support',
                lodged: true,
                partyPrimary: true,
                previousDocument: 'Petition',
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
              sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
        {
          category: 'Supporting Document',
          documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: 'Amended Answer',
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseStatus: Case.STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                category: 'Supporting Document',
                documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Amended Answer',
                documentType: 'Brief in Support',
                lodged: true,
                partyPrimary: true,
                previousDocument: 'Amended Answer',
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
              sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2019-03-01T22:54:06.000Z',
            },
          ],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: false,
      initialDocketNumberSuffix: 'S',
      initialTitle:
        'Test Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      practitioners: [],
      preferredTrialCity: 'Aberdeen, South Dakota',
      procedureType: 'Small',
      status: Case.STATUS_TYPES.new,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'Test Docketclerk',
        role: User.ROLES.docketClerk,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    const workItems = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(workItems.length).toEqual(4);

    expect(workItems).toMatchObject([
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          attachments: false,
          caseId,
          category: 'Motion',
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
        sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseId,
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          category: 'Supporting Document',
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          partyPrimary: true,
          previousDocument: 'Amended Answer',
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
        sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
        updatedAt: '2019-03-01T22:54:06.000Z',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          category: 'Supporting Document',
          documentId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: 'Petition',
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
        sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
        updatedAt: '2019-03-01T22:54:06.000Z',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          category: 'Supporting Document',
          documentId: '42de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: 'Amended Answer',
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
        sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
