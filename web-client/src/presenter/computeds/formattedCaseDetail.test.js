import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from './formattedCaseDetail';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const getDateISO = () =>
  applicationContext.getUtilities().createISODateString();

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();

export const simpleDocketEntries = [
  {
    createdAt: getDateISO(),
    docketEntryId: '123',
    documentTitle: 'Petition',
    filedBy: 'Jessica Frase Marine',
    filingDate: '2019-02-28T21:14:39.488Z',
    isOnDocketRecord: true,
  },
];

export const mockPetitioners = [
  {
    address1: '734 Cowley Parkway',
    address2: 'Cum aut velit volupt',
    address3: 'Et sunt veritatis ei',
    city: 'Et id aut est velit',
    contactId: '0e891509-4e33-49f6-bb2a-23b327faf6f1',
    contactType: CONTACT_TYPES.primary,
    countryType: 'domestic',
    email: 'petitioner@example.com',
    isAddressSealed: false,
    name: 'Mona Schultz',
    phone: '+1 (884) 358-9729',
    postalCode: '77546',
    sealedAndUnavailable: false,
    serviceIndicator: 'Electronic',
    state: 'CT',
  },
];

describe('formattedCaseDetail', () => {
  let globalUser;
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    STATUS_TYPES,
    TRIAL_CLERKS_SECTION,
    USER_ROLES,
  } = applicationContext.getConstants();

  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
    };
  };

  const petitionsClerkUser = {
    role: USER_ROLES.petitionsClerk,
    userId: '111',
  };
  const docketClerkUser = {
    role: USER_ROLES.docketClerk,
    userId: '222',
  };
  const petitionerUser = {
    role: USER_ROLES.petitioner,
    userId: '333',
  };
  const judgeUser = {
    role: USER_ROLES.judge,
    userId: '444',
  };
  const chambersUser = {
    role: USER_ROLES.chambers,
    section: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
    userId: '555',
  };
  const trialClerkUser = {
    role: USER_ROLES.trialClerk,
    section: TRIAL_CLERKS_SECTION,
    userId: '777',
  };

  it('does not error and returns expected empty values on empty caseDetail', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [],
          petitioners: mockPetitioners,
        },
      },
    });
    expect(result).toMatchObject({
      caseDeadlines: [],
      formattedDocketEntries: [],
    });
  });

  it('maps docket record dates', () => {
    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: simpleDocketEntries,
    };
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        validationErrors: {},
      },
    });

    expect(result.formattedDocketEntries[0].createdAtFormatted).toEqual(
      '02/28/19',
    );
  });

  it('maps docket record documents', () => {
    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: simpleDocketEntries,
    };
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        validationErrors: {},
      },
    });
    expect(result.formattedDocketEntries[0].docketEntryId).toEqual('123');
  });

  it('returns editDocketEntryMetaLinks with formatted docket entries', () => {
    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: simpleDocketEntries,
    };

    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        validationErrors: {},
      },
    });

    expect(result.formattedDocketEntries).toMatchObject([
      {
        editDocketEntryMetaLink: `/case-detail/${MOCK_CASE.docketNumber}/docket-entry/${simpleDocketEntries[0].index}/edit-meta`,
      },
    ]);
  });

  describe('createdAtFormatted', () => {
    const baseDocument = {
      createdAt: '2019-04-19T17:29:13.120Z',
      docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
      documentTitle: 'Amended Petition',
      documentType: 'Amended Petition',
      eventCode: 'PAP',
      filingDate: '2019-04-19T17:29:13.120Z',
      isFileAttached: true,
      isOnDocketRecord: true,
      partyPrimary: true,
      scenario: 'Standard',
      servedAt: '2019-06-19T17:29:13.120Z',
    };

    it('should be a formatted date string if the document is on the docket record and is served', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [baseDocument],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries).toMatchObject([
        {
          createdAtFormatted: '04/19/19',
        },
      ]);
    });

    it('should be a formatted date string if the document is on the docket record and is an unserved external document', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...baseDocument,
            servedAt: undefined,
          },
        ],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries).toMatchObject([
        {
          createdAtFormatted: '04/19/19',
        },
      ]);
    });

    it('should be undefined if the document is on the docket record and is an unserved court-issued document', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...baseDocument,
            documentTitle: 'Order',
            documentType: 'Order',
            eventCode: 'O',
            servedAt: undefined,
          },
        ],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries).toMatchObject([
        {
          createdAtFormatted: undefined,
        },
      ]);
    });
  });

  it('should format only lodged documents with overridden eventCode MISCL', () => {
    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: [
        {
          docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
          documentTitle: 'Motion for Leave to File Administrative Record',
          documentType: 'Motion for Leave to File Administrative Record',
          eventCode: 'M115',
          filingDate: '2020-07-08T16:33:41.180Z',
          lodged: true,
        },
        {
          docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6b',
          documentTitle: 'Motion for Leave to File Administrative Record',
          documentType: 'Motion for Leave to File Administrative Record',
          eventCode: 'M115',
          filingDate: '2020-07-08T16:33:41.180Z',
          lodged: false,
        },
      ],
    };

    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        validationErrors: {},
      },
    });

    const lodgedDocument = result.formattedDocketEntries.find(
      d => d.docketEntryId === '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
    );
    const unlodgedDocument = result.formattedDocketEntries.find(
      d => d.docketEntryId === '5d96bdfd-dc10-40db-b640-ef10c2591b6b',
    );

    expect(lodgedDocument.eventCode).toEqual('MISCL');
    expect(unlodgedDocument.eventCode).not.toEqual('MISCL');
  });

  describe('sorts docket records', () => {
    let sortedCaseDetail;

    beforeAll(() => {
      sortedCaseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2019-02-28T21:14:39.488Z',
            docketEntryId: 'Petition',
            documentTitle: 'Petition',
            documentType: 'Petition',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28T21:10:55.488Z',
            index: 1,
            isOnDocketRecord: true,
            showValidationInput: '2019-02-28T21:14:39.488Z',
            status: 'served',
          },
          {
            docketEntryId: 'Request for Place of Trial',
            documentTitle: 'Request for Place of Trial',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28T21:10:33.488Z',
            index: 2,
            isOnDocketRecord: true,
          },
          {
            createdAt: '2019-03-28T21:14:39.488Z',
            docketEntryId: 'Ownership Disclosure Statement',
            documentTitle: 'Ownership Disclosure Statement',
            documentType: 'Ownership Disclosure Statement',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-03-28T21:14:39.488Z',
            index: 4,
            isOnDocketRecord: true,
            showValidationInput: '2019-03-28T21:14:39.488Z',
            status: 'served',
          },
          {
            createdAt: '2019-01-01T21:14:39.488Z',
            docketEntryId: 'Other',
            documentTitle: 'Other',
            documentType: 'Other',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28',
            index: 3,
            isOnDocketRecord: true,
            showValidationInput: '2019-01-01T21:14:39.488Z',
            status: 'served',
          },
        ],
      };
    });

    it('sorts the docket record in the expected default order (ascending date)', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries[0]).toMatchObject({
        documentType: 'Petition',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        documentType: 'Other',
      });
      expect(result.formattedDocketEntries[3]).toMatchObject({
        documentType: 'Ownership Disclosure Statement',
      });
    });

    it('sorts the docket record by descending date', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.docketNumber]: 'byDateDesc' },
          },
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries[3]).toMatchObject({
        documentTitle: 'Petition',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        documentTitle: 'Other',
      });
      expect(result.formattedDocketEntries[0]).toMatchObject({
        documentTitle: 'Ownership Disclosure Statement',
      });
    });

    it('sorts the docket record by ascending index', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.docketNumber]: 'byIndex' },
          },
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries[0]).toMatchObject({
        documentTitle: 'Petition',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[3]).toMatchObject({
        documentTitle: 'Ownership Disclosure Statement',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        documentTitle: 'Other',
      });
    });

    it('sorts the docket record by descending index', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.docketNumber]: 'byIndexDesc' },
          },
          validationErrors: {},
        },
      });
      expect(result.formattedDocketEntries[0]).toMatchObject({
        documentTitle: 'Ownership Disclosure Statement',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        documentTitle: 'Other',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[3]).toMatchObject({
        documentTitle: 'Petition',
      });
    });
  });

  describe('case name mapping', () => {
    it('should not error if caseCaption does not exist', () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: undefined,
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual('');
    });

    it("should remove ', Petitioner' from caseCaption", () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: 'Sisqo, Petitioner',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual('Sisqo');
    });

    it("should remove ', Petitioners' from caseCaption", () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: 'Sisqo and friends,  Petitioners ',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual('Sisqo and friends');
    });

    it("should remove ', Petitioner(s)' from caseCaption", () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: "Sisqo's entourage,,    Petitioner(s)    ",
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual("Sisqo's entourage,");
    });
  });

  describe('practitioner mapping', () => {
    it('should add barNumber into formatted name if available', () => {
      const caseDetail = {
        ...MOCK_CASE,
        privatePractitioners: [
          { barNumber: '9999', name: 'Jackie Chan', representing: [] },
        ],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.privatePractitioners[0].formattedName).toEqual(
        'Jackie Chan (9999)',
      );
    });

    it('should not add barNumber into formatted name if not available', () => {
      const caseDetail = {
        ...MOCK_CASE,
        privatePractitioners: [{ name: 'Jackie Chan', representing: [] }],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.privatePractitioners[0].formattedName).toEqual(
        'Jackie Chan',
      );
    });
  });

  describe('trial detail mapping mapping', () => {
    it('should format trial information if a trial session id exists', () => {
      const caseDetail = {
        ...MOCK_CASE,
        associatedJudge: 'Judge Judy',
        status: STATUS_TYPES.calendared,
        trialDate: '2018-12-11T05:00:00Z',
        trialLocation: 'England is my City',
        trialSessionId: '123',
        trialTime: '20:30',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('12/11/18 08:30 pm');
      expect(result.formattedAssociatedJudge).toEqual('Judge Judy');
    });

    it('should not add time if no time stamp exists', () => {
      const caseDetail = {
        ...MOCK_CASE,
        associatedJudge: 'Judge Judy',
        status: STATUS_TYPES.calendared,
        trialDate: '2018-12-11T05:00:00Z',
        trialLocation: 'England is my City',
        trialSessionId: '123',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('12/11/18');
      expect(result.formattedAssociatedJudge).toEqual('Judge Judy');
    });
  });

  describe('formats case deadlines', () => {
    it('formats deadline dates, sorts them by date, and sets overdue to true if date is before today', () => {
      const caseDeadlines = [
        {
          deadlineDate: '2019-06-30T04:00:00.000Z',
        },
        {
          deadlineDate: '2019-01-30T05:00:00.000Z',
        },
        {
          deadlineDate: '2025-07-30T04:00:00.000Z',
        },
      ];

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDeadlines,
          caseDetail: MOCK_CASE,
          validationErrors: {},
        },
      });
      expect(result.caseDeadlines.length).toEqual(3);
      expect(result.caseDeadlines).toEqual([
        {
          deadlineDate: '2019-01-30T05:00:00.000Z',
          deadlineDateFormatted: '01/30/19',
          overdue: true,
        },
        {
          deadlineDate: '2019-06-30T04:00:00.000Z',
          deadlineDateFormatted: '06/30/19',
          overdue: true,
        },
        {
          deadlineDate: '2025-07-30T04:00:00.000Z',
          deadlineDateFormatted: '07/30/25',
        },
      ]);
    });

    it('formats deadline dates and does not set overdue to true if the deadlineDate is today', () => {
      const caseDeadlines = [
        {
          deadlineDate: applicationContext.getUtilities().createISODateString(),
        },
      ];

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDeadlines,
          caseDetail: MOCK_CASE,
          validationErrors: {},
        },
      });
      expect(result.caseDeadlines.length).toEqual(1);
      expect(result.caseDeadlines[0].overdue).toBeUndefined();
    });

    it('does not format empty caseDeadlines array', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: MOCK_CASE,
          validationErrors: {},
        },
      });
      expect(result.caseDeadlines.length).toEqual(0);
    });
  });

  describe('draft documents', () => {
    let caseDetail;

    beforeAll(() => {
      const docketEntries = [
        {
          createdAt: '2019-02-28T21:14:39.488Z',
          description: 'Petition',
          docketEntryId: 'Petition',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
          index: 1,
          isOnDocketRecord: true,
          showValidationInput: '2019-02-28T21:14:39.488Z',
          status: 'served',
        },
        {
          archived: false,
          createdAt: '2019-02-28T21:14:39.488Z',
          docketEntryId: 'd-1-2-3',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          isDraft: true,
          isOnDocketRecord: false,
        },
        {
          archived: false,
          createdAt: '2019-02-28T21:14:39.488Z',
          docketEntryId: 'd-2-3-4',
          documentTitle: 'Stipulated Decision',
          documentType: 'Stipulated Decision',
          eventCode: 'SDEC',
          isDraft: true,
          isOnDocketRecord: false,
        },
      ];

      caseDetail = {
        ...MOCK_CASE,
        docketEntries,
      };
    });

    it('formats draft documents', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.formattedDraftDocuments).toMatchObject([
        {
          createdAtFormatted: '02/28/19',
          descriptionDisplay: 'Order to do something',
          docketEntryId: 'd-1-2-3',
          documentType: 'Order',
          isCourtIssuedDocument: true,
          isInProgress: false,
          isNotServedDocument: true,
          isPetition: false,
          isStatusServed: false,
          showDocumentViewerLink: true,
          signedAtFormatted: undefined,
          signedAtFormattedTZ: undefined,
        },
        {
          createdAtFormatted: '02/28/19',
          descriptionDisplay: 'Stipulated Decision',
          docketEntryId: 'd-2-3-4',
          documentType: 'Stipulated Decision',
          isCourtIssuedDocument: true,
          isInProgress: false,
          isNotServedDocument: true,
          isPetition: false,
          isStatusServed: false,
          showDocumentViewerLink: true,
          signedAtFormatted: undefined,
          signedAtFormattedTZ: undefined,
        },
      ]);
    });

    it("doesn't format draft documents if there are none", () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [caseDetail.docketEntries[0]],
          },
          validationErrors: {},
        },
      });

      expect(result.formattedDraftDocuments).toEqual([]);
    });
  });

  describe('consolidatedCases', () => {
    it('should format consolidated cases if they exist', () => {
      const caseDetail = {
        ...MOCK_CASE,
        associatedJudge: 'Judge Judy',
        consolidatedCases: [
          {
            associatedJudge: 'Guy Fieri',
            correspondence: [],
            docketEntries: [],
            status: STATUS_TYPES.calendared,
            trialDate: '2018-12-11T05:00:00Z',
            trialLocation: 'Flavortown',
            trialSessionId: '123',
          },
        ],
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.consolidatedCases).toBeDefined();
      expect(result.consolidatedCases.length).toEqual(1);
    });

    it('should default consolidatedCases to an empty array if they do not exist', () => {
      const caseDetail = {
        ...MOCK_CASE,
        consolidatedCases: undefined,
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.consolidatedCases).toBeDefined();
      expect(result.consolidatedCases).toEqual([]);
    });
  });

  describe('stricken docket record', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            docketEntryId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            filingDate: '2019-06-19T17:29:13.120Z',
            isFileAttached: true,
            isLegacy: true,
            isOnDocketRecord: true,
            isStricken: true,
            numberOfPages: 24,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
        ],
      };
    });

    it('should not show the link to an external user for a document with a stricken docket record', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].isStricken).toEqual(true);
      expect(
        result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
      ).toEqual(true);
      expect(result.formattedDocketEntries[0].showLinkToDocument).toEqual(
        false,
      );
      expect(result.formattedDocketEntries[0].showDocumentViewerLink).toEqual(
        false,
      );
    });

    it('should not show the link to an associated external user when the document has isLegacySealed true', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...caseDetail.docketEntries[0],
                isLegacySealed: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
                servedAt: '2020-01-23T21:44:54.034Z',
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].isLegacySealed).toBeTruthy();
      expect(
        result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
      ).toEqual(true);
      expect(result.formattedDocketEntries[0].showLinkToDocument).toEqual(
        false,
      );
      expect(result.formattedDocketEntries[0].showDocumentViewerLink).toEqual(
        false,
      );
    });

    it('should show the link to an associated external user when the document has isLegacyServed true and servedAt undefined', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...caseDetail.docketEntries[0],
                isLegacyServed: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].isLegacyServed).toBeTruthy();
      expect(
        result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
      ).toEqual(false);
      expect(result.formattedDocketEntries[0].showLinkToDocument).toEqual(true);
      expect(result.formattedDocketEntries[0].showDocumentViewerLink).toEqual(
        false,
      );
    });

    it('should NOT show the link to an associated external user when the document has isLegacyServed undefined and servedAt undefined', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...caseDetail.docketEntries[0],
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
      ).toEqual(true);
      expect(result.formattedDocketEntries[0].showLinkToDocument).toEqual(
        false,
      );
      expect(result.formattedDocketEntries[0].showDocumentViewerLink).toEqual(
        false,
      );
    });

    it('should show the link to an internal user for a document with a stricken docket record', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].isStricken).toEqual(true);
      expect(
        result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
      ).toEqual(false);
      expect(result.formattedDocketEntries[0].showLinkToDocument).toEqual(
        false,
      );
      expect(result.formattedDocketEntries[0].showDocumentViewerLink).toEqual(
        true,
      );
    });
  });

  describe('showEAccessFlag', () => {
    let baseContact;
    let contactPrimary;
    let contactSecondary;
    let otherPetitioners;
    let otherFilers;
    let caseDetail;

    beforeEach(() => {
      baseContact = {
        hasEAccess: true,
      };
      contactPrimary = { ...baseContact, contactType: CONTACT_TYPES.primary };
      contactSecondary = {
        ...baseContact,
        contactType: CONTACT_TYPES.secondary,
      };
      otherPetitioners = [
        { ...baseContact, contactType: CONTACT_TYPES.otherPetitioner },
      ];
      otherFilers = [{ ...baseContact, contactType: CONTACT_TYPES.otherFiler }];

      caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            docketEntryId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            filingDate: '2019-06-19T17:29:13.120Z',
            isLegacy: true,
            isStricken: true,
            numberOfPages: 24,
          },
        ],
        petitioners: [
          contactPrimary,
          contactSecondary,
          ...otherFilers,
          ...otherPetitioners,
        ],
      };
    });

    it('sets the showEAccessFlag to false for internal users when a contact does not have legacy access', () => {
      baseContact.hasEAccess = false;
      contactPrimary.hasEAccess = false;
      contactSecondary.hasEAccess = false;
      otherFilers[0].hasEAccess = false;
      otherPetitioners[0].hasEAccess = false;

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.contactPrimary.showEAccessFlag).toEqual(false);
      expect(result.contactSecondary.showEAccessFlag).toEqual(false);
      expect(result.otherFilers[0].showEAccessFlag).toEqual(false);
      expect(result.otherFilers[0].serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );
      expect(result.otherPetitioners[0].showEAccessFlag).toEqual(false);
    });

    it('sets the showEAccessFlag to true for internal users when contact has legacy access', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.contactPrimary.showEAccessFlag).toEqual(true);
      expect(result.contactSecondary.showEAccessFlag).toEqual(true);
      expect(result.otherFilers[0].showEAccessFlag).toEqual(true);
      expect(result.otherFilers[0].serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );
      expect(result.otherPetitioners[0].showEAccessFlag).toEqual(true);
    });

    it('sets the showEAccessFlag to false for external users when contact has legacy access', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.contactPrimary.showEAccessFlag).toEqual(false);
      expect(result.contactSecondary.showEAccessFlag).toEqual(false);
      expect(result.otherFilers[0].showEAccessFlag).toEqual(false);
      expect(result.otherFilers[0].serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );
      expect(result.otherPetitioners[0].showEAccessFlag).toEqual(false);
    });
  });

  describe('formattedDocketEntriesOnDocketRecord and formattedPendingDocketEntriesOnDocketRecord', () => {
    it('should return formatted docket entries that are on the docket record, and in the pending list', () => {
      const baseDocketEntry = {
        createdAt: '2020-09-18T17:38:31.774Z',
        entityName: 'DocketEntry',
        filedBy: 'Petr. Mona Schultz',
        filingDate: '2020-09-18T17:38:31.772Z',
        isDraft: false,
        numberOfPages: 11,
        partyPrimary: true,
        partySecondary: false,
        processingStatus: 'complete',
        receivedAt: '2020-09-18T17:38:31.775Z',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      };

      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...baseDocketEntry,
            docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
            index: 1,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            pending: false,
          },
          {
            ...baseDocketEntry,
            docketEntryId: '087eb3f6-b164-40f3-980f-835da7292097',
            documentTitle: 'Request for Place of Trial at Seattle, Washington',
            documentType: 'Request for Place of Trial',
            eventCode: 'RQT',
            index: 2,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            isStricken: false,
            pending: false,
          },
          {
            ...baseDocketEntry,
            docketEntryId: '2efcd272-da92-4e31-bedc-28cdad2e08b0',
            documentTitle: 'Statement of Taxpayer Identification',
            documentType: 'Statement of Taxpayer Identification',
            eventCode: 'STIN',
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: false,
            isStricken: false,
            pending: false,
          },
          {
            ...baseDocketEntry,
            docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            index: 3,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            pending: true,
            servedAt: '2020-09-18T17:38:32.418Z',
            servedParties: [
              { email: 'petitioner@example.com', name: 'Mona Schultz' },
            ],
          },
          {
            ...baseDocketEntry,
            docketEntryId: 'aa632296-fb1d-4aa7-8f06-6eeab813ac09',
            documentTitle: 'Answer',
            documentType: 'Answer',
            eventCode: 'A',
            index: 4,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            pending: true,
          },
          {
            ...baseDocketEntry,
            docketEntryId: 'aa632296-fb1d-4aa7-8f06-6eeab813ac09',
            documentTitle: 'Hearing',
            documentType: 'Hearing before',
            eventCode: 'HEAR',
            index: 5,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            pending: true,
          },
        ],
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          ...getBaseState(petitionsClerkUser),
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
      ]);

      expect(result.formattedPendingDocketEntriesOnDocketRecord.length).toEqual(
        2,
      );
      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        {
          eventCode: 'PSDE',
          isOnDocketRecord: true,
          pending: true,
        },
        {
          eventCode: 'HEAR',
          isOnDocketRecord: true,
          pending: true,
        },
      ]);
    });

    it('should add items to formattedPendingDocketEntriesOnDocketRecord when isLegacyServed is true and the item is pending', async () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[2],
            docketEntryId: '999999',
            isLegacyServed: true,
            isOnDocketRecord: true,
            pending: true,
            servedAt: undefined,
            servedParties: undefined,
          },
        ],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          ...getBaseState(petitionsClerkUser),
        },
      });

      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        { docketEntryId: '999999' },
      ]);
    });

    it('should add items to formattedPendingDocketEntriesOnDocketRecord when servedAt is defined and the item is pending', async () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[2],
            docketEntryId: '999999',
            isLegacyServed: false,
            isOnDocketRecord: true,
            pending: true,
            servedAt: '2019-08-25T05:00:00.000Z',
            servedParties: [
              {
                name: 'Bernard Lowe',
              },
              {
                name: 'IRS',
                role: 'irsSuperuser',
              },
            ],
          },
        ],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          ...getBaseState(petitionsClerkUser),
        },
      });

      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        { docketEntryId: '999999' },
      ]);
    });
  });

  describe('userIsAssignedToSession', () => {
    it("should be true when the case's trial session judge is the currently logged in user", () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(judgeUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeTruthy();
    });

    it("should be false when the case's trial session judge is not the currently logged in user", () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(petitionsClerkUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeFalsy();
    });

    it('should be true when the current user is a chambers user for the judge assigned to the trial session the case is scheduled for', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          judgeUser: {
            section: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
            userId: judgeUser.userId,
          },
          ...getBaseState(chambersUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeTruthy();
    });

    it('should be false when the current user is a chambers user for a different judge than the one assigned to the case', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          judgeUser: {
            section: JUDGES_CHAMBERS.BUCHS_CHAMBERS_SECTION.section,
            userId: judgeUser.userId,
          },
          ...getBaseState(chambersUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeFalsy();
    });

    it('should be true when the current user is the trial clerk assigned to the trial session the case is scheduled for', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(trialClerkUser),
          trialSessions: [
            {
              trialClerk: {
                userId: trialClerkUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeTruthy();
    });

    it('should be false when the current user is a trial clerk and is not assigned to the trial session the case is scheduled for', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(trialClerkUser),
          trialSessions: [
            {
              trialClerk: {},
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeFalsy();
    });

    describe('hearings - userIsAssignedToSession', () => {
      it("should be true when the hearing's trial session judge is the currently logged in user", () => {
        const mockTrialSessionId = applicationContext.getUniqueId();

        const result = runCompute(formattedCaseDetail, {
          state: {
            caseDetail: {
              ...MOCK_CASE,
              hearings: [
                {
                  judge: {
                    userId: judgeUser.userId,
                  },
                  trialSessionId: '123',
                },
                {
                  judge: {
                    userId: 'some_other_id',
                  },
                  trialSessionId: '234',
                },
              ],
              trialSessionId: mockTrialSessionId,
            },
            ...getBaseState(judgeUser),
            trialSessions: [
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: mockTrialSessionId,
              },
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: '123',
              },
              {
                judge: {
                  userId: 'some_other_id',
                },
                trialSessionId: '234',
              },
            ],
          },
        });

        expect(result.hearings).toMatchObject([
          {
            judge: {
              userId: judgeUser.userId,
            },
            trialSessionId: '123',
            userIsAssignedToSession: true,
          },
          {
            judge: {
              userId: 'some_other_id',
            },
            trialSessionId: '234',
            userIsAssignedToSession: false,
          },
        ]);
      });

      it('should be true when the current user is a chambers user for the judge assigned to a hearing the case is scheduled for', () => {
        const mockTrialSessionId = applicationContext.getUniqueId();

        const result = runCompute(formattedCaseDetail, {
          state: {
            caseDetail: {
              ...MOCK_CASE,
              hearings: [
                {
                  judge: {
                    userId: judgeUser.userId,
                  },
                  trialSessionId: '123',
                },
                {
                  judge: {
                    userId: 'some_other_id',
                  },
                  trialSessionId: '234',
                },
              ],
            },
            judgeUser: {
              section: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
              userId: judgeUser.userId,
            },
            ...getBaseState(chambersUser),
            trialSessions: [
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: mockTrialSessionId,
              },
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: '123',
              },
              {
                judge: {
                  userId: 'some_other_id',
                },
                trialSessionId: '234',
              },
            ],
          },
        });

        expect(result.hearings).toMatchObject([
          {
            judge: {
              userId: judgeUser.userId,
            },
            trialSessionId: '123',
            userIsAssignedToSession: true,
          },
          {
            judge: {
              userId: 'some_other_id',
            },
            trialSessionId: '234',
            userIsAssignedToSession: false,
          },
        ]);
      });

      it('should be true when the current user is the trial clerk assigned to a hearing the case is scheduled for', () => {
        const mockTrialSessionId = applicationContext.getUniqueId();

        const result = runCompute(formattedCaseDetail, {
          state: {
            caseDetail: {
              ...MOCK_CASE,
              hearings: [
                {
                  judge: {
                    userId: judgeUser.userId,
                  },
                  trialClerk: {
                    userId: 'some_other_id',
                  },
                  trialSessionId: '123',
                },
                {
                  judge: {
                    userId: 'some_other_id',
                  },
                  trialClerk: {
                    userId: trialClerkUser.userId,
                  },
                  trialSessionId: '234',
                },
              ],
            },
            ...getBaseState(trialClerkUser),
            trialSessions: [
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialClerk: {
                  userId: trialClerkUser.userId,
                },
                trialSessionId: mockTrialSessionId,
              },
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialClerk: {
                  userId: 'some_other_id',
                },
                trialSessionId: '123',
              },
              {
                judge: {
                  userId: 'some_other_id',
                },
                trialClerk: {
                  userId: trialClerkUser.userId,
                },
                trialSessionId: '234',
              },
            ],
          },
        });

        expect(result.hearings).toMatchObject([
          {
            judge: {
              userId: judgeUser.userId,
            },
            trialClerk: {
              userId: 'some_other_id',
            },
            trialSessionId: '123',
            userIsAssignedToSession: false,
          },
          {
            judge: {
              userId: 'some_other_id',
            },
            trialClerk: {
              userId: trialClerkUser.userId,
            },
            trialSessionId: '234',
            userIsAssignedToSession: true,
          },
        ]);
      });
    });
  });

  describe('qcNeeded', () => {
    const mockDocketEntry = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-18',
      documentTitle: 'Petition',
      documentType: applicationContext.getConstants().INITIAL_DOCUMENT_TYPES
        .petition.documentType,
      eventCode: applicationContext.getConstants().INITIAL_DOCUMENT_TYPES
        .petition.eventCode,
      filedBy: 'Test Petitioner',
      filingDate: '2018-03-01T00:01:00.000Z',
      index: 1,
      isFileAttached: true,
      isOnDocketRecord: true,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T00:01:00.000Z',
      servedAt: '2020-04-29T15:51:29.168Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      workItem: {
        completedAt: undefined,
        isRead: false,
      },
    };

    it('should set qcNeeded to true when work item is not read', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            docketEntries: [mockDocketEntry],
            docketNumber: '123-45',
          },
          ...getBaseState(docketClerkUser),
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        qcNeeded: true,
      });
    });

    it('should set qcNeeded to false when qcWorkItemsUntouched is true and work item is read', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            docketEntries: [
              {
                ...mockDocketEntry,
                workItem: {
                  completedAt: '2020-04-29T15:51:29.168Z',
                  isRead: true,
                },
              },
            ],
            docketNumber: '123-45',
          },
          ...getBaseState(docketClerkUser),
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        qcNeeded: false,
      });
    });
  });

  it('should sort hearings by the addedToSessionAt field', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          docketNumber: '123-45',
          hearings: [
            {
              trialSessionId: '234',
            },
            {
              trialSessionId: '123',
            },
            {
              trialSessionId: '345',
            },
          ],
        },
        ...getBaseState(docketClerkUser),
        trialSessionId: '987',
        trialSessions: [
          {
            caseOrder: [
              {
                addedToSessionAt: '2019-04-19T17:29:13.120Z',
                calendarNotes: 'SECOND',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '234',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2018-04-19T17:29:13.120Z',
                calendarNotes: 'FIRST',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '123',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2020-04-19T17:29:13.120Z',
                calendarNotes: 'THIRD',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '345',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2018-05-19T17:29:13.120Z',
                calendarNotes: 'CASE TRIAL SESSION',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '987',
          },
        ],
      },
    });

    expect(result.hearings[0]).toMatchObject({
      addedToSessionAt: '2018-04-19T17:29:13.120Z',
      calendarNotes: 'FIRST',
      trialSessionId: '123',
    });

    expect(result.hearings[1]).toMatchObject({
      addedToSessionAt: '2019-04-19T17:29:13.120Z',
      calendarNotes: 'SECOND',
      trialSessionId: '234',
    });

    expect(result.hearings[2]).toMatchObject({
      addedToSessionAt: '2020-04-19T17:29:13.120Z',
      calendarNotes: 'THIRD',
      trialSessionId: '345',
    });
  });
});
