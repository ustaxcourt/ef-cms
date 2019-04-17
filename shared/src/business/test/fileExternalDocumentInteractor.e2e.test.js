const sinon = require('sinon');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  fileExternalDocument,
} = require('../useCases/externalDocument/fileExternalDocumentInteractor');
const {
  getWorkItemsBySection,
} = require('../useCases/workitems/getWorkItemsBySectionInteractor');
const { createCase } = require('../useCases/createCaseInteractor');
const { getCase } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';

describe('fileExternalDocument integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(CREATED_DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Rick Petitioner',
        role: 'petitioner',
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should attach the expected documents to the case', async () => {
    const { caseId } = await createCase({
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
          email: 'taxpayer@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: 'Petitioner',
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    await fileExternalDocument({
      applicationContext,
      documentMetadata: {
        attachments: false,
        caseId,
        category: 'Answer (filed by respondent only)',
        certificateOfService: false,
        docketNumber: '201-19',
        documentTitle: 'Amended Answer',
        documentType: 'Amended Answer',
        exhibits: false,
        hasSupportingDocuments: true,
        partyPrimary: true,
        scenario: 'Standard',
        secondaryDocument: {},
        serviceDate: 'undefined-undefined-undefined',
        supportingDocument: 'Brief in Support',
        supportingDocumentMetadata: {
          category: 'Supporting Document',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          previousDocument: 'Amended Answer',
          scenario: 'Nonstandard A',
        },
      },
      primaryDocumentFileId: '12de0fac-f63c-464f-ac71-0f54fd248484',
      supportingDocumentFileId: '22de0fac-f63c-464f-ac71-0f54fd248484',
    });

    const caseAfterDocument = await getCase({
      applicationContext,
      caseId,
    });
    expect(caseAfterDocument).toMatchObject({
      caseCaption: 'Rick Petitioner, Petitioner',
      caseId,
      caseTitle:
        'Rick Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      caseType: 'Innocent Spouse',
      contactPrimary: {
        address1: '19 First Freeway',
        address2: 'Ad cumque quidem lau',
        address3: 'Anim est dolor animi',
        city: 'Rerum eaque cupidata',
        countryType: 'domestic',
        email: 'taxpayer@example.com',
        name: 'Rick Petitioner',
        phone: '+1 (599) 681-5435',
        postalCode: '89614',
        state: 'AP',
      },
      contactSecondary: {},
      currentVersion: '2',
      docketNumber: '101-19',
      docketNumberSuffix: 'S',
      docketRecord: [
        {
          description: 'Request for Place of Trial at Aberdeen, South Dakota',
        },
        {
          description: 'Petition',
          documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          filedBy: 'Rick Petitioner',
          status: undefined,
        },
        {
          description: 'Amended Answer',
          documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
        },
        {
          description: 'Brief in Support of Amended Answer',
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
        },
      ],
      documents: [
        {
          caseId,
          documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          documentType: 'Petition',
          filedBy: 'Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: 'New',
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                documentId: '92eac064-9ca5-4c56-80a0-c5852c752277',
                documentType: 'Petition',
                filedBy: 'Rick Petitioner',
                userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              isInitializeCase: true,
              messages: [
                {
                  from: 'Rick Petitioner',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Rick Petitioner is ready for review.',
                },
              ],
              section: 'petitions',
              sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
        {
          caseId,
          documentId: '72de0fac-f63c-464f-ac71-0f54fd248484',
          documentType: 'Statement of Taxpayer Identification',
          filedBy: 'Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        {
          attachments: false,
          caseId,
          category: 'Answer (filed by respondent only)',
          certificateOfService: false,
          docketNumber: '201-19',
          documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Amended Answer',
          documentType: 'Amended Answer',
          exhibits: false,
          hasSupportingDocuments: true,
          partyPrimary: true,
          scenario: 'Standard',
          serviceDate: 'undefined-undefined-undefined',
          supportingDocument: 'Brief in Support',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: 'New',
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                attachments: false,
                caseId,
                category: 'Answer (filed by respondent only)',
                certificateOfService: false,
                docketNumber: '201-19',
                documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Amended Answer',
                documentType: 'Amended Answer',
                exhibits: false,
                hasSupportingDocuments: true,
                partyPrimary: true,
                scenario: 'Standard',
                serviceDate: 'undefined-undefined-undefined',
                supportingDocument: 'Brief in Support',
                userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              messages: [
                {
                  from: 'Rick Petitioner',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Amended Answer filed by Petitioner is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
        {
          caseId,
          category: 'Supporting Document',
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          previousDocument: 'Amended Answer',
          scenario: 'Nonstandard A',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId,
              caseStatus: 'New',
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                category: 'Supporting Document',
                documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
                documentTitle: 'Brief in Support of Amended Answer',
                documentType: 'Brief in Support',
                previousDocument: 'Amended Answer',
                scenario: 'Nonstandard A',
                userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              messages: [
                {
                  from: 'Rick Petitioner',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Brief in Support filed by Petitioner is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: false,
      initialDocketNumberSuffix: 'S',
      initialTitle:
        'Rick Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: 'Petitioner',
      practitioner: null,
      preferredTrialCity: 'Aberdeen, South Dakota',
      procedureType: 'Small',
      status: 'New',
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'bob',
        role: 'docketclerk',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    const workItems = await getWorkItemsBySection({
      applicationContext,
      section: 'docket',
    });

    expect(workItems).toMatchObject([
      {
        assigneeId: null,
        assigneeName: null,
        caseId,
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          attachments: false,
          caseId,
          category: 'Answer (filed by respondent only)',
          certificateOfService: false,
          docketNumber: '201-19',
          documentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Amended Answer',
          documentType: 'Amended Answer',
          exhibits: false,
          hasSupportingDocuments: true,
          partyPrimary: true,
          scenario: 'Standard',
          serviceDate: 'undefined-undefined-undefined',
          supportingDocument: 'Brief in Support',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        messages: [
          {
            from: 'Rick Petitioner',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Amended Answer filed by Petitioner is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseId,
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          category: 'Supporting Document',
          documentId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          previousDocument: 'Amended Answer',
          scenario: 'Nonstandard A',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        messages: [
          {
            from: 'Rick Petitioner',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Brief in Support filed by Petitioner is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
