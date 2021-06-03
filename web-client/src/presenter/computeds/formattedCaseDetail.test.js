import {
  CONTACT_TYPES,
  PAYMENT_STATUS,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  formattedCaseDetail as formattedCaseDetailComputed,
  formattedClosedCases as formattedClosedCasesComputed,
  formattedOpenCases as formattedOpenCasesComputed,
  getShowDocumentViewerLink,
} from './formattedCaseDetail';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const getDateISO = () =>
  applicationContext.getUtilities().createISODateString();

describe('formattedCaseDetail', () => {
  let globalUser;
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    DOCUMENT_RELATIONSHIPS,
    JUDGES_CHAMBERS,
    OBJECTIONS_OPTIONS_MAP,
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

  const formattedOpenCases = withAppContextDecorator(
    formattedOpenCasesComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  const formattedClosedCases = withAppContextDecorator(
    formattedClosedCasesComputed,
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

  const mockPetitioners = [
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

  const simpleDocketEntries = [
    {
      createdAt: getDateISO(),
      docketEntryId: '123',
      documentTitle: 'Petition',
      filedBy: 'Jessica Frase Marine',
      filingDate: '2019-02-28T21:14:39.488Z',
      isOnDocketRecord: true,
    },
  ];

  const complexDocketEntries = [
    {
      attachments: false,
      category: 'Petition',
      certificateOfService: false,
      createdAt: '2019-04-19T17:29:13.120Z',
      docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
      documentTitle: 'Amended Petition',
      documentType: 'Amended Petition',
      eventCode: 'PAP',
      filingDate: '2019-04-19T17:29:13.120Z',
      hasSupportingDocuments: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      partyPrimary: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Standard',
      servedAt: '2019-06-19T17:29:13.120Z',
      supportingDocument:
        'Unsworn Declaration under Penalty of Perjury in Support',
      supportingDocumentFreeText: 'Test',
    },
    {
      attachments: false,
      category: 'Miscellaneous',
      certificateOfService: false,
      createdAt: '2019-04-19T18:24:09.515Z',
      docketEntryId: 'c501a558-7632-497e-87c1-0c5f39f66718',
      documentTitle:
        'First Amended Unsworn Declaration under Penalty of Perjury in Support',
      documentType: 'Amended',
      eventCode: 'ADED',
      filingDate: '2019-04-19T17:31:09.515Z',
      hasSupportingDocuments: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      ordinalValue: 'First',
      partyIrsPractitioner: true,
      partyPrimary: true,
      previousDocument:
        'Unsworn Declaration under Penalty of Perjury in Support',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Nonstandard F',
      servedAt: '2019-06-19T17:29:13.120Z',
      supportingDocument: 'Brief in Support',
      supportingDocumentFreeText: null,
    },
    {
      attachments: true,
      category: 'Motion',
      certificateOfService: true,
      certificateOfServiceDate: '2018-06-07',
      certificateOfServiceDay: '7',
      certificateOfServiceMonth: '6',
      certificateOfServiceYear: '2018',
      createdAt: '2019-04-19T17:39:10.476Z',
      docketEntryId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
      documentTitle:
        'Motion for Leave to File Computation for Entry of Decision',
      documentType: 'Motion for Leave to File',
      eventCode: 'M115',
      filingDate: '2019-04-19T17:39:10.476Z',
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      objections: OBJECTIONS_OPTIONS_MAP.YES,
      partyPrimary: true,
      partySecondary: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Nonstandard H',
      secondarySupportingDocument: null,
      secondarySupportingDocumentFreeText: null,
      servedAt: '2019-06-19T17:29:13.120Z',
      supportingDocument: 'Declaration in Support',
      supportingDocumentFreeText: 'Rachael',
    },
    {
      addToCoversheet: true,
      additionalInfo: 'Additional Info',
      additionalInfo2: 'Additional Info2',
      category: 'Supporting Document',
      createdAt: '2019-04-19T17:29:13.122Z',
      docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
      documentTitle:
        'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
      documentType: 'Unsworn Declaration under Penalty of Perjury in Support',
      eventCode: 'USDL',
      filingDate: '2019-04-19T17:42:13.122Z',
      freeText: 'Test',
      isFileAttached: true,
      isOnDocketRecord: true,
      lodged: true,
      partyIrsPractitioner: true,
      partyPrivatePractitioner: true,
      previousDocument: 'Amended Petition',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
      scenario: 'Nonstandard C',
      servedAt: '2019-06-19T17:29:13.120Z',
    },
    {
      createdAt: '2019-04-19T17:29:13.122Z',
      docketEntryId: '42b49268-81d3-4b92-81c3-f1edc26ca844',
      documentTitle: 'Hearing Exhibits for asdfasdfasdf',
      documentType: 'Hearing Exhibits',
      eventCode: 'HE',
      filingDate: '2020-07-08T16:33:41.180Z',
      freeText: 'adsf',
      isFileAttached: true,
      isOnDocketRecord: true,
      lodged: false,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Type A',
      servedAt: '2019-06-19T17:29:13.120Z',
    },
  ];

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
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
      docketEntries: simpleDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: mockPetitioners,
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
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
      docketEntries: simpleDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: mockPetitioners,
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

  it('formats docket record document data strings and descriptions and docket entry fields correctly', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      contactSecondary: {
        name: 'Bill',
      },
      correspondence: [],
      docketEntries: complexDocketEntries,
      hasVerifiedIrsNotice: false,
      otherFilers: [],
      otherPetitioners: [],
      petitioners: mockPetitioners,
      privatePractitioners: [{ name: 'Test Practitioner', representing: [] }],
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
        descriptionDisplay: 'Amended Petition',
        filingsAndProceedings: '(No Objection)',
      },
      {
        descriptionDisplay:
          'First Amended Unsworn Declaration under Penalty of Perjury in Support',
        filingsAndProceedings: '',
      },
      {
        descriptionDisplay:
          'Motion for Leave to File Computation for Entry of Decision',
        filingsAndProceedings: '(C/S 06/07/18) (Attachment(s)) (Objection)',
      },
      {
        descriptionDisplay:
          'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition Additional Info',
        filingsAndProceedings: '(Lodged)',
      },
      {
        descriptionDisplay: 'Hearing Exhibits for asdfasdfasdf',
        filingsAndProceedings: '',
      },
    ]);

    expect(result.formattedDocketEntries).toMatchObject([
      {
        descriptionDisplay: 'Amended Petition',
        filingsAndProceedingsWithAdditionalInfo: ' (No Objection)',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
      {
        descriptionDisplay:
          'First Amended Unsworn Declaration under Penalty of Perjury in Support',
        filingsAndProceedingsWithAdditionalInfo: '',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
      {
        descriptionDisplay:
          'Motion for Leave to File Computation for Entry of Decision',
        filingsAndProceedingsWithAdditionalInfo:
          ' (C/S 06/07/18) (Attachment(s)) (Objection)',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
      {
        descriptionDisplay:
          'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition Additional Info',
        filingsAndProceedingsWithAdditionalInfo: ' (Lodged) Additional Info2',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
      {
        descriptionDisplay: 'Hearing Exhibits for asdfasdfasdf',
        filingsAndProceedingsWithAdditionalInfo: '',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showEditDocketRecordEntry: false,
        showLinkToDocument: false,
      },
    ]);
  });

  it('returns editDocketEntryMetaLinks with formatted docket entries', () => {
    const DOCKET_NUMBER = '101-20';
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      contactSecondary: {
        name: 'Bill',
      },
      correspondence: [],
      docketEntries: simpleDocketEntries,
      docketNumber: DOCKET_NUMBER,
      hasVerifiedIrsNotice: false,
      otherFilers: [],
      otherPetitioners: [],
      petitioners: mockPetitioners,
      privatePractitioners: [{ name: 'Test Practitioner', representing: [] }],
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
        editDocketEntryMetaLink: `/case-detail/${DOCKET_NUMBER}/docket-entry/${simpleDocketEntries[0].index}/edit-meta`,
      },
    ]);
  });

  describe('createdAtFormatted', () => {
    const baseCaseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      contactSecondary: {
        name: 'Bill',
      },
      correspondence: [],
      hasVerifiedIrsNotice: false,
      petitioners: [
        {
          contactType: CONTACT_TYPES.primary,
          name: 'Bob',
        },
      ],
      privatePractitioners: [],
    };

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
        ...baseCaseDetail,
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
        ...baseCaseDetail,
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
        ...baseCaseDetail,
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
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
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
      otherFilers: [],
      otherPetitioners: [],
      petitioners: mockPetitioners,
      privatePractitioners: [{ name: 'Test Practitioner', representing: [] }],
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
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
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
        docketNumber: '123-45',
        hasVerifiedIrsNotice: false,
        petitioners: mockPetitioners,
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
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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
        caseCaption: 'Sisqo, Petitioner',
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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
        caseCaption: 'Sisqo and friends,  Petitioners ',
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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
        caseCaption: "Sisqo's entourage,,    Petitioner(s)    ",
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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
        caseCaption: 'Sisqo, Petitioner',
        correspondence: [],
        docketEntries: [],
        otherFilers: [],
        otherPetitioners: [],
        petitioners: mockPetitioners,
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
        caseCaption: 'Sisqo, Petitioner',
        correspondence: [],
        docketEntries: [],
        otherFilers: [],
        otherPetitioners: [],
        petitioners: mockPetitioners,
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
        associatedJudge: 'Judge Judy',
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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
        associatedJudge: 'Judge Judy',
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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
      const caseDetail = {
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
      };
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
          caseDetail,
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
      const caseDetail = {
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
      };
      const caseDeadlines = [
        {
          deadlineDate: applicationContext.getUtilities().createISODateString(),
        },
      ];

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDeadlines,
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseDeadlines.length).toEqual(1);
      expect(result.caseDeadlines[0].overdue).toBeUndefined();
    });

    it('does not format empty caseDeadlines array', () => {
      const caseDetail = {
        caseDeadlines: [],
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
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
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
        docketEntries,
        hasVerifiedIrsNotice: false,
        petitioners: mockPetitioners,
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
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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

      expect(result.consolidatedCases).toBeDefined();
      expect(result.consolidatedCases.length).toEqual(1);
    });

    it('should default consolidatedCases to an empty array if they do not exist', () => {
      const caseDetail = {
        associatedJudge: 'Judge Judy',
        correspondence: [],
        docketEntries: [],
        petitioners: mockPetitioners,
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

      expect(result.consolidatedCases).toBeDefined();
      expect(result.consolidatedCases).toEqual([]);
    });
  });

  describe('getCalendarDetailsForTrialSession', () => {
    it('adds the calendarNotes from the trialSession caseOrder if a trialSessionId is set on the case', () => {
      const caseDetail = {
        associatedJudge: 'Judge Judy',
        correspondence: [],
        docketEntries: [],
        docketNumber: '123-45',
        petitioners: mockPetitioners,
        status: STATUS_TYPES.calendared,
        trialDate: '2018-12-11T05:00:00Z',
        trialLocation: 'England is my City',
        trialSessionId: '123',
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          trialSessions: [
            {
              caseOrder: [
                {
                  calendarNotes: 'Test notes',
                  docketNumber: '123-45',
                },
              ],
              trialSessionId: '123',
            },
          ],
          validationErrors: {},
        },
      });

      expect(result.trialSessionNotes).toEqual('Test notes');
    });

    it('adds calendarNotes and addedToSessionAt fields from trialSessions to case hearings', () => {
      const caseDetail = {
        associatedJudge: 'Judge Judy',
        correspondence: [],
        docketEntries: [],
        docketNumber: '123-45',
        hearings: [
          {
            trialSessionId: '234',
          },
          {
            trialSessionId: '345',
          },
        ],
        petitioners: mockPetitioners,
        status: STATUS_TYPES.calendared,
        trialDate: '2018-12-11T05:00:00Z',
        trialLocation: 'England is my City',
        trialSessionId: '123',
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          trialSessions: [
            {
              caseOrder: [
                {
                  docketNumber: '123-45',
                },
              ],
              trialSessionId: '123',
            },
            {
              caseOrder: [
                {
                  addedToSessionAt: '2019-01-01T17:29:13.122Z',
                  calendarNotes: 'Hearing notes one.',
                  docketNumber: '123-45',
                },
              ],
              trialSessionId: '234',
            },
            {
              caseOrder: [
                {
                  addedToSessionAt: '2019-01-02T17:29:13.122Z',
                  calendarNotes: 'Hearing notes two.',
                  docketNumber: '123-45',
                },
              ],
              trialSessionId: '345',
            },
          ],
          validationErrors: {},
        },
      });

      expect(result.hearings).toMatchObject([
        {
          addedToSessionAt: '2019-01-01T17:29:13.122Z',
          calendarNotes: 'Hearing notes one.',
          trialSessionId: '234',
        },
        {
          addedToSessionAt: '2019-01-02T17:29:13.122Z',
          calendarNotes: 'Hearing notes two.',
          trialSessionId: '345',
        },
      ]);
    });
  });

  describe('showEditDocketRecordEntry', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Bob',
          },
        ],
      };
    });

    it('should not show the edit button if the docket entry document has not been QCed', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
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
                index: 1,
                isOnDocketRecord: true,
                workItem: {},
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeFalsy();
    });

    it('should show the edit button if the docket entry document has been QCed as part of the petition QC', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                createdAt: '2020-10-21T13:46:55.621Z',
                docketEntryId: '3d9c3e7e-f12e-40ef-8076-7dd31d5adbf0',
                documentTitle: 'Ownership Disclosure Statement',
                documentType: 'Ownership Disclosure Statement',
                entityName: 'DocketEntry',
                eventCode: 'DISC',
                filedBy: 'Petr. Benedict Byers',
                filingDate: '2020-10-21T13:46:55.618Z',
                index: 3,
                isDraft: false,
                isFileAttached: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
                pending: false,
                receivedAt: '2020-10-21T13:46:55.621Z',
                servedAt: '2020-10-21T13:47:20.482Z',
                servedParties: [
                  {
                    name: 'IRS',
                    role: 'irsSuperuser',
                  },
                ],
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeTruthy();
    });

    it('should not show the edit button if the user does not have permission', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
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
                index: 1,
                isOnDocketRecord: true,
                workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: false,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeFalsy();
    });

    it('should show the edit button if the docket entry document is QCed and the user has permission', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
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
                index: 1,
                isOnDocketRecord: true,
                workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeTruthy();
    });

    it('should show the edit button if the docket entry has no document and the user has permission', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                description: 'Filing Fee Paid',
                docketEntryId: 'd8e4c0ba-db97-4294-bb22-9ffdd584e8f4',
                eventCode: 'FEE',
                filingDate: '2019-06-20T17:29:13.120Z',
                index: 2,
                isMinuteEntry: true,
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeTruthy();
    });

    it('should show the edit button if the docket entry has a system generated document', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                attachments: false,
                certificateOfService: false,
                createdAt: '2019-06-19T17:29:13.120Z',
                description: 'System Generated',
                docketEntryId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
                documentTitle: 'System Generated',
                documentType: 'Notice of Trial',
                eventCode: 'NTD',
                filingDate: '2019-06-21T17:29:13.120Z',
                isOnDocketRecord: true,
                servedAt: '2019-06-19T17:29:13.120Z',
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeTruthy();
    });

    it('should NOT show the edit button if the docket entry has an unserved court issued document', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                attachments: false,
                certificateOfService: false,
                createdAt: '2019-06-19T17:29:13.120Z',
                description: 'Court Issued - Not Served',
                docketEntryId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
                documentTitle: 'Court Issued - Not Served',
                documentType: 'Order',
                eventCode: 'O',
                filingDate: '2019-06-22T17:29:13.120Z',
                isCourtIssuedDocument: true,
                isOnDocketRecord: true,
                workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeFalsy();
    });

    it('should show the edit button if the docket entry has a served court issued document', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                attachments: false,
                certificateOfService: false,
                createdAt: '2019-06-19T17:29:13.120Z',
                description: 'Court Issued - Served',
                docketEntryId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
                documentTitle: 'Court Issued - Served',
                documentType: 'Order',
                eventCode: 'O',
                filingDate: '2019-06-23T17:29:13.120Z',
                isCourtIssuedDocument: true,
                isOnDocketRecord: true,
                servedAt: '2019-06-19T17:29:13.120Z',
                status: 'served',
                workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeTruthy();
    });

    it('should show the edit button if the document is an unservable court issued document', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                attachments: false,
                certificateOfService: false,
                createdAt: '2019-06-19T17:29:13.120Z',
                description: 'Court Issued - Unservable',
                docketEntryId: '90094dbb-72bf-481e-a592-8d50dad7ffa9',
                documentTitle: 'U.S.C.A',
                documentType: 'U.S.C.A.',
                eventCode: 'USCA',
                filingDate: '2019-06-24T17:29:13.120Z',
                isCourtIssuedDocument: true,
                isOnDocketRecord: true,
                servedAt: '2019-06-19T17:29:13.120Z',
                status: 'served',
                workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
              },
            ],
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeTruthy();
    });
  });

  describe('showEditDocketRecordEntry', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
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
            index: 1,
            isOnDocketRecord: true,
            numberOfPages: 24,
          },
          {
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Filing Fee Paid',
            filingDate: '2019-06-19T17:29:13.120Z',
            index: 2,
            isOnDocketRecord: true,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'System Generated',
            docketEntryId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            documentTitle: 'System Generated',
            documentType: 'Notice of Trial',
            eventCode: 'NTD',
            filingDate: '2019-06-19T17:29:13.120Z',
            index: 3,
            isOnDocketRecord: true,
            numberOfPages: 2,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Not Served',
            docketEntryId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            documentTitle: 'Court Issued - Not Served',
            documentType: 'Order',
            eventCode: 'O',
            filingDate: '2019-06-19T17:29:13.120Z',
            index: 4,
            isCourtIssuedDocument: true,
            isOnDocketRecord: true,
            numberOfPages: 7,
            workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Served',
            docketEntryId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            documentTitle: 'Court Issued - Served',
            documentType: 'Order',
            eventCode: 'O',
            filingDate: '2019-06-19T17:29:13.120Z',
            index: 5,
            isCourtIssuedDocument: true,
            isOnDocketRecord: true,
            numberOfPages: 9,
            servedAt: '2019-06-19T17:29:13.120Z',
            status: 'served',
            workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
          },
        ],
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Bob',
          },
        ],
      };
    });

    it('should show number of pages from the document', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].numberOfPages).toEqual(24);
    });

    it('should show zero (0) number of pages with no document', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[1].numberOfPages).toEqual(0);
    });
  });

  it('should not show the link to an unassociated external user for a pending paper filed document', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [
            {
              ...simpleDocketEntries[0],
              processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
            },
          ],
        },
        permissions: {
          CREATE_ORDER_DOCKET_ENTRY: false,
          DOCKET_ENTRY: false,
          UPDATE_CASE: false,
        },
        validationErrors: {},
      },
    });

    expect(
      result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
    ).toEqual(false);
    expect(result.formattedDocketEntries[0].showDocumentProcessing).toEqual(
      true,
    );
  });

  it('should not show the link to an unassociated external user for a complete paper filed document', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [
            {
              ...simpleDocketEntries[0],
              processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
            },
          ],
        },
        permissions: {
          CREATE_ORDER_DOCKET_ENTRY: false,
          DOCKET_ENTRY: false,
          UPDATE_CASE: false,
        },
        screenMetadata: {
          isAssociated: false,
        },
        validationErrors: {},
      },
    });

    expect(
      result.formattedDocketEntries[0].showDocumentDescriptionWithoutLink,
    ).toEqual(true);
    expect(result.formattedDocketEntries[0].showDocumentProcessing).toEqual(
      false,
    );
  });

  describe('stricken docket record', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
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
          {
            description: 'Filing Fee Paid',
            docketEntryId: '69094dbb-72bf-481e-a592-8d50dad7ffb1',
            filingDate: '2019-06-19T17:29:13.120Z',
            isFileAttached: false,
            isOnDocketRecord: true,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'System Generated',
            docketEntryId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            documentTitle: 'System Generated',
            documentType: 'Notice of Trial',
            eventCode: 'NTD',
            filingDate: '2019-06-19T17:29:13.120Z',
            isFileAttached: true,
            isOnDocketRecord: true,
            numberOfPages: 2,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Not Served',
            docketEntryId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            documentTitle: 'Court Issued - Not Served',
            documentType: 'Order',
            eventCode: 'O',
            filingDate: '2019-06-19T17:29:13.120Z',
            isCourtIssuedDocument: true,
            isFileAttached: true,
            isOnDocketRecord: true,
            numberOfPages: 7,
            workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Served',
            docketEntryId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            documentTitle: 'Court Issued - Served',
            documentType: 'Order',
            eventCode: 'O',
            filingDate: '2019-06-19T17:29:13.120Z',
            isCourtIssuedDocument: true,
            isFileAttached: true,
            isOnDocketRecord: true,
            numberOfPages: 9,
            servedAt: '2019-06-19T17:29:13.120Z',
            status: 'served',
            workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
          },
        ],
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Bob',
          },
        ],
      };
    });

    it('should not show the link to an external user for a document with a stricken docket record', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail,
          permissions: {
            CREATE_ORDER_DOCKET_ENTRY: false,
            DOCKET_ENTRY: false,
            UPDATE_CASE: false,
          },
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
          permissions: {
            CREATE_ORDER_DOCKET_ENTRY: false,
            DOCKET_ENTRY: false,
            UPDATE_CASE: false,
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
          permissions: {
            CREATE_ORDER_DOCKET_ENTRY: false,
            DOCKET_ENTRY: false,
            UPDATE_CASE: false,
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
          permissions: {
            CREATE_ORDER_DOCKET_ENTRY: false,
            DOCKET_ENTRY: false,
            UPDATE_CASE: false,
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
          permissions: {
            CREATE_ORDER_DOCKET_ENTRY: true,
            DOCKET_ENTRY: true,
            UPDATE_CASE: true,
          },
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
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
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
        partyType: 'Petitioner',
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
          permissions: {},
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
          permissions: {},
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
          permissions: {},
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

  describe('getShowDocumentViewerLink', () => {
    const tests = [
      {
        inputs: {
          hasDocument: true,
          isExternalUser: false,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: false,
          isExternalUser: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isExternalUser: true,
          isStricken: true,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isUnservable: true,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isServed: true,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: true,
          userHasAccessToCase: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: false,
          userHasAccessToCase: true,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: true,
          userHasAccessToCase: true,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isServed: false,
          isUnservable: true,
          userHasAccessToCase: true,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: false,
          userHasAccessToCase: true,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: true,
          userHasAccessToCase: true,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: true,
          userHasAccessToCase: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isServed: false,
          isUnservable: true,
          userHasAccessToCase: true,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: false,
          isUnservable: false,
          userHasAccessToCase: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isServed: false,
          isUnservable: true,
          userHasAccessToCase: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isExternalUser: true,
          userHasNoAccessToDocument: true,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isInitialDocument: true,
          isServed: false,
          isStricken: false,
          isUnservable: false,
          userHasAccessToCase: true,
          userHasNoAccessToDocument: false,
        },
        output: true,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: false,
          isExternalUser: true,
          isInitialDocument: true,
          isServed: false,
          isStricken: false,
          isUnservable: false,
          userHasAccessToCase: false,
          userHasNoAccessToDocument: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isInitialDocument: false,
          isServed: true,
          isStipDecision: true,
          isStricken: false,
          isUnservable: false,
          userHasAccessToCase: false,
          userHasNoAccessToDocument: false,
        },
        output: false,
      },
      {
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isInitialDocument: false,
          isServed: true,
          isStipDecision: true,
          isStricken: false,
          isUnservable: false,
          userHasAccessToCase: true,
          userHasNoAccessToDocument: false,
        },
        output: true,
      },
      {
        // User is external, with no access to case, document link is not publicly visible
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isHiddenToPublic: true,
          isUnservable: true,
          userHasAccessToCase: false,
        },
        output: false,
      },
      {
        // User is external, with access to case, document link is visible
        inputs: {
          hasDocument: true,
          isCourtIssuedDocument: true,
          isExternalUser: true,
          isHiddenToPublic: true,
          isUnservable: true,
          userHasAccessToCase: true,
        },
        output: true,
      },
    ];

    tests.forEach(({ inputs, output }) => {
      it(`returns expected output of '${output}' for inputs ${JSON.stringify(
        inputs,
      )}`, () => {
        const result = getShowDocumentViewerLink(inputs);
        expect(result).toEqual(output);
      });
    });
  });

  describe('showNotServed', () => {
    let baseContact;
    let contactSecondary;
    let otherPetitioners;
    let otherFilers;
    let caseDetail;

    beforeEach(() => {
      baseContact = {
        hasEAccess: true,
      };

      contactSecondary = baseContact;
      otherPetitioners = [baseContact];
      otherFilers = [baseContact];

      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactSecondary,
        correspondence: [],
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
            isOnDocketRecord: true,
            isStricken: true,
            numberOfPages: 24,
          },
        ],
        otherFilers,
        otherPetitioners,
        partyType: 'Petitioner',
        petitioners: [{ ...baseContact, contactType: CONTACT_TYPES.primary }],
      };
    });

    it('should be true if the document type is servable and does not have a servedAt', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          permissions: {},
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].showNotServed).toEqual(true);
    });

    it('should be false if the document type is unservable', () => {
      //CTRA is a document type that cannot be served
      caseDetail.docketEntries[0].eventCode = 'CTRA';
      caseDetail.docketEntries[0].documentType = 'Corrected Transcript';

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          permissions: {},
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].showNotServed).toEqual(false);
      expect(result.formattedDocketEntries[0].isInProgress).toEqual(false);
      expect(result.formattedDocketEntries[0].createdAtFormatted).toEqual(
        '06/19/19',
      );
    });

    it('should be false if the document type is servable and has servedAt', () => {
      caseDetail.docketEntries[0].servedAt = '2019-06-19T17:29:13.120Z';

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          permissions: {},
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].showNotServed).toEqual(false);
      expect(result.formattedDocketEntries[0].isInProgress).toEqual(false);
      expect(result.formattedDocketEntries[0].createdAtFormatted).toEqual(
        '06/19/19',
      );
    });
  });

  describe('showServed', () => {
    let baseContact;
    let contactPrimary;
    let contactSecondary;
    let otherPetitioners;
    let otherFilers;
    let caseDetail;

    const mockDocketEntry = {
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
      isOnDocketRecord: true,
      isStatusServed: true,
      isStricken: true,
      numberOfPages: 24,
      servedAt: '2019-06-19T17:29:13.120Z',
      servedParties: [{ name: 'IRS', role: 'irsSuperuser' }],
    };

    beforeEach(() => {
      baseContact = {
        hasEAccess: true,
      };
      contactPrimary = baseContact;
      contactSecondary = baseContact;
      otherPetitioners = [baseContact];
      otherFilers = [baseContact];

      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactSecondary,
        correspondence: [],
        docketEntries: [mockDocketEntry],
        otherFilers,
        otherPetitioners,
        partyType: 'Petitioner',
        petitioners: [
          { ...contactPrimary, contactType: CONTACT_TYPES.primary },
        ],
      };
    });

    it('is true when the entry has been served', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail,
          permissions: {},
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].showServed).toEqual(true);
    });

    it('is false when the entry has not been served', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...caseDetail,
            docketEntries: [
              {
                ...mockDocketEntry,
                servedAt: undefined,
                servedParties: [],
              },
            ],
          },
          permissions: {},
          validationErrors: {},
        },
      });

      expect(result.formattedDocketEntries[0].showServed).toEqual(false);
    });
  });

  describe('formattedOpenCases', () => {
    it('should return formatted open cases', () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
        createdAt: '2020-02-02T17:29:13.120Z',
        docketEntries: simpleDocketEntries,
        hasVerifiedIrsNotice: false,
        petitioners: mockPetitioners,
      };

      const result = runCompute(formattedOpenCases, {
        state: {
          openCases: [caseDetail],
        },
      });

      expect(result).toMatchObject([{ createdAtFormatted: '02/02/20' }]);
    });
  });

  describe('formattedClosedCases', () => {
    it('should return formatted closed cases', () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
        createdAt: '2020-02-02T17:29:13.120Z',
        docketEntries: simpleDocketEntries,
        hasVerifiedIrsNotice: false,
        petitioners: mockPetitioners,
      };

      const result = runCompute(formattedClosedCases, {
        state: {
          closedCases: [caseDetail],
        },
      });

      expect(result).toMatchObject([{ createdAtFormatted: '02/02/20' }]);
    });
  });

  describe('formattedDocketEntriesOnDocketRecord and formattedPendingDocketEntriesOnDocketRecord', () => {
    it('should return formatted docket entries that are on the docket record, and in the pending list', () => {
      const caseDetail = {
        archivedCorrespondences: [],
        archivedDocketEntries: [],
        associatedJudge: 'Chief Judge',
        automaticBlocked: true,
        automaticBlockedDate: '2020-09-18T17:38:32.439Z',
        automaticBlockedReason: 'Pending Item',
        caseCaption: 'Mona Schultz, Petitioner',
        caseType: 'CDP (Lien/Levy)',
        correspondence: [],
        createdAt: '2020-09-18T17:38:31.772Z',
        docketEntries: [
          {
            createdAt: '2020-09-18T17:38:31.774Z',
            docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            documentTitle: 'Petition',
            documentType: 'Petition',
            entityName: 'DocketEntry',
            eventCode: 'P',
            filedBy: 'Petr. Mona Schultz',
            filingDate: '2020-09-18T17:38:31.772Z',
            index: 1,
            isDraft: false,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            numberOfPages: 11,
            partyPrimary: true,
            partySecondary: false,
            pending: false,
            privatePractitioners: [],
            processingStatus: 'complete',
            receivedAt: '2020-09-18T17:38:31.775Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItem: {
              assigneeId: null,
              assigneeName: null,
              associatedJudge: 'Chief Judge',
              caseStatus: 'New',
              caseTitle: 'Mona Schultz',
              createdAt: '2020-09-18T17:38:31.775Z',
              docketEntry: {
                createdAt: '2020-09-18T17:38:31.774Z',
                docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
                documentTitle: 'Petition',
                documentType: 'Petition',
                entityName: 'DocketEntry',
                eventCode: 'P',
                filedBy: 'Petr. Mona Schultz',
                filingDate: '2020-09-18T17:38:31.772Z',
                isDraft: false,
                isFileAttached: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
                partyPrimary: true,
                partySecondary: false,
                pending: false,
                privatePractitioners: [],
                processingStatus: 'pending',
                receivedAt: '2020-09-18T17:38:31.775Z',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              },
              docketNumber: '169-20',
              docketNumberWithSuffix: '169-20L',
              entityName: 'WorkItem',
              isInitializeCase: true,
              section: 'petitions',
              sentBy: 'Test Petitioner',
              sentByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2020-09-18T17:38:31.775Z',
              workItemId: 'e4c84638-0401-4061-8eff-c6cac530ae51',
            },
          },
          {
            createdAt: '2020-09-18T17:38:31.775Z',
            docketEntryId: '087eb3f6-b164-40f3-980f-835da7292097',
            documentTitle: 'Request for Place of Trial at Seattle, Washington',
            documentType: 'Request for Place of Trial',
            entityName: 'DocketEntry',
            eventCode: 'RQT',
            filingDate: '2020-09-18T17:38:31.772Z',
            index: 2,
            isDraft: false,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            isStricken: false,
            pending: false,
            processingStatus: 'complete',
            receivedAt: '2020-09-18T17:38:31.776Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            createdAt: '2020-09-18T17:38:31.776Z',
            docketEntryId: '2efcd272-da92-4e31-bedc-28cdad2e08b0',
            documentTitle: 'Statement of Taxpayer Identification',
            documentType: 'Statement of Taxpayer Identification',
            entityName: 'DocketEntry',
            eventCode: 'STIN',
            filedBy: 'Petr. Mona Schultz',
            filingDate: '2020-09-18T17:38:31.772Z',
            isDraft: false,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: false,
            isStricken: false,
            numberOfPages: 11,
            partyPrimary: true,
            partySecondary: false,
            pending: false,
            privatePractitioners: [],
            processingStatus: 'complete',
            receivedAt: '2020-09-18T17:38:31.776Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            attachments: false,
            certificateOfService: false,
            certificateOfServiceDate: null,
            createdAt: '2020-09-18T17:38:32.417Z',
            docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
            docketNumber: '169-20',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            draftOrderState: null,
            entityName: 'DocketEntry',
            eventCode: 'PSDE',
            filedBy: 'Resp.',
            filingDate: '2020-09-18T17:38:32.418Z',
            hasSupportingDocuments: false,
            index: 3,
            isDraft: false,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            numberOfPages: 2,
            partyIrsPractitioner: true,
            pending: true,
            privatePractitioners: [],
            processingStatus: 'complete',
            receivedAt: '2020-09-18T17:38:32.418Z',
            relationship: 'primaryDocument',
            scenario: 'Standard',
            servedAt: '2020-09-18T17:38:32.418Z',
            servedParties: [
              { email: 'petitioner@example.com', name: 'Mona Schultz' },
            ],
            userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            workItem: {
              assigneeId: null,
              assigneeName: null,
              associatedJudge: 'Chief Judge',
              caseStatus: 'New',
              caseTitle: 'Mona Schultz',
              createdAt: '2020-09-18T17:38:32.418Z',
              docketEntry: {
                attachments: false,
                certificateOfService: false,
                certificateOfServiceDate: null,
                createdAt: '2020-09-18T17:38:32.417Z',
                docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
                docketNumber: '169-20',
                documentTitle: 'Proposed Stipulated Decision',
                documentType: 'Proposed Stipulated Decision',
                entityName: 'DocketEntry',
                eventCode: 'PSDE',
                filedBy: 'Resp.',
                filingDate: '2020-09-18T17:38:32.418Z',
                hasSupportingDocuments: false,
                isDraft: false,
                isFileAttached: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
                partyIrsPractitioner: true,
                pending: true,
                privatePractitioners: [],
                processingStatus: 'pending',
                receivedAt: '2020-09-18T17:38:32.418Z',
                relationship: 'primaryDocument',
                scenario: 'Standard',
                userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
              },
              docketNumber: '169-20',
              docketNumberWithSuffix: '169-20L',
              entityName: 'WorkItem',
              highPriority: false,
              section: 'docket',
              sentBy: 'Test IRS Practitioner',
              sentByUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2020-09-18T17:38:32.418Z',
              workItemId: '5f4eb5ac-099d-4e14-8b26-dfbf1828f0d7',
            },
          },
          {
            attachments: false,
            certificateOfService: false,
            certificateOfServiceDate: null,
            createdAt: '2020-09-18T17:38:32.417Z',
            docketEntryId: 'aa632296-fb1d-4aa7-8f06-6eeab813ac09',
            docketNumber: '169-20',
            documentTitle: 'Answer',
            documentType: 'Answer',
            draftOrderState: null,
            entityName: 'DocketEntry',
            eventCode: 'A',
            filedBy: 'Resp.',
            filingDate: '2020-09-18T17:38:32.418Z',
            hasSupportingDocuments: false,
            index: 4,
            isDraft: false,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            numberOfPages: 2,
            partyIrsPractitioner: true,
            pending: true,
            privatePractitioners: [],
            processingStatus: 'complete',
            receivedAt: '2020-09-18T17:38:32.418Z',
            relationship: 'primaryDocument',
            scenario: 'Standard',
            userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            attachments: false,
            certificateOfService: false,
            certificateOfServiceDate: null,
            createdAt: '2020-09-18T17:38:32.417Z',
            docketEntryId: 'aa632296-fb1d-4aa7-8f06-6eeab813ac09',
            docketNumber: '169-20',
            documentTitle: 'Hearing',
            documentType: 'Hearing before',
            draftOrderState: null,
            entityName: 'DocketEntry',
            eventCode: 'HEAR',
            filedBy: 'Resp.',
            filingDate: '2020-09-18T17:38:32.418Z',
            hasSupportingDocuments: false,
            index: 5,
            isDraft: false,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            numberOfPages: 2,
            partyIrsPractitioner: true,
            pending: true,
            privatePractitioners: [],
            processingStatus: 'complete',
            receivedAt: '2020-09-18T17:38:32.418Z',
            relationship: 'primaryDocument',
            scenario: 'Standard',
            userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        docketNumber: '169-20',
        docketNumberSuffix: 'L',
        docketNumberWithSuffix: '169-20L',
        entityName: 'Case',
        filingType: 'Myself',
        hasPendingItems: true,
        initialCaption: 'Mona Schultz, Petitioner',
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
            email: 'irsPractitioner@example.com',
            entityName: 'IrsPractitioner',
            name: 'Test IRS Practitioner',
            role: 'irsPractitioner',
            serviceIndicator: 'Electronic',
            userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        isPaper: false,
        isSealed: false,
        noticeOfAttachments: false,
        noticeOfTrialDate: '2020-09-18T17:38:31.772Z',
        orderDesignatingPlaceOfTrial: false,
        orderForAmendedPetition: false,
        orderForAmendedPetitionAndFilingFee: false,
        orderForFilingFee: true,
        orderForOds: false,
        orderForRatification: false,
        orderToShowCause: false,
        otherFilers: [],
        otherPetitioners: [],
        partyType: 'Petitioner',
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        petitioners: [
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
        ],
        preferredTrialCity: 'Seattle, Washington',
        privatePractitioners: [],
        procedureType: 'Regular',
        qcCompleteForTrial: {},
        receivedAt: '2020-09-18T17:38:31.772Z',
        sortableDocketNumber: 20000169,
        statistics: [],
        status: 'New',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
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
    const caseDetail = {
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      associatedJudge: 'Chief Judge',
      automaticBlocked: true,
      automaticBlockedDate: '2020-09-18T17:38:32.439Z',
      automaticBlockedReason: 'Pending Item',
      caseCaption: 'Mona Schultz, Petitioner',
      caseType: 'CDP (Lien/Levy)',
      correspondence: [],
      createdAt: '2020-09-18T17:38:31.772Z',
      docketEntries: [
        {
          createdAt: '2020-09-18T17:38:31.774Z',
          docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          documentTitle: 'Petition',
          documentType: 'Petition',
          entityName: 'DocketEntry',
          eventCode: 'P',
          filedBy: 'Petr. Mona Schultz',
          filingDate: '2020-09-18T17:38:31.772Z',
          index: 1,
          isDraft: false,
          isFileAttached: true,
          isMinuteEntry: false,
          isOnDocketRecord: true,
          isStricken: false,
          numberOfPages: 11,
          partyPrimary: true,
          partySecondary: false,
          pending: false,
          privatePractitioners: [],
          processingStatus: 'complete',
          receivedAt: '2020-09-18T17:38:31.775Z',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            associatedJudge: 'Chief Judge',
            caseStatus: 'New',
            caseTitle: 'Mona Schultz',
            createdAt: '2020-09-18T17:38:31.775Z',
            docketEntry: {
              createdAt: '2020-09-18T17:38:31.774Z',
              docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
              documentTitle: 'Petition',
              documentType: 'Petition',
              entityName: 'DocketEntry',
              eventCode: 'P',
              filedBy: 'Petr. Mona Schultz',
              filingDate: '2020-09-18T17:38:31.772Z',
              isDraft: false,
              isFileAttached: true,
              isMinuteEntry: false,
              isOnDocketRecord: true,
              isStricken: false,
              partyPrimary: true,
              partySecondary: false,
              pending: false,
              privatePractitioners: [],
              processingStatus: 'pending',
              receivedAt: '2020-09-18T17:38:31.775Z',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber: '169-20',
            docketNumberWithSuffix: '169-20L',
            entityName: 'WorkItem',
            isInitializeCase: true,
            section: 'petitions',
            sentBy: 'Test Petitioner',
            sentByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            updatedAt: '2020-09-18T17:38:31.775Z',
            workItemId: 'e4c84638-0401-4061-8eff-c6cac530ae51',
          },
        },
        {
          createdAt: '2020-09-18T17:38:31.775Z',
          docketEntryId: '087eb3f6-b164-40f3-980f-835da7292097',
          documentTitle: 'Request for Place of Trial at Seattle, Washington',
          documentType: 'Request for Place of Trial',
          entityName: 'DocketEntry',
          eventCode: 'RQT',
          filingDate: '2020-09-18T17:38:31.772Z',
          index: 2,
          isDraft: false,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          isStricken: false,
          pending: false,
          processingStatus: 'complete',
          receivedAt: '2020-09-18T17:38:31.776Z',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          createdAt: '2020-09-18T17:38:31.776Z',
          docketEntryId: '2efcd272-da92-4e31-bedc-28cdad2e08b0',
          documentTitle: 'Statement of Taxpayer Identification',
          documentType: 'Statement of Taxpayer Identification',
          entityName: 'DocketEntry',
          eventCode: 'STIN',
          filedBy: 'Petr. Mona Schultz',
          filingDate: '2020-09-18T17:38:31.772Z',
          isDraft: false,
          isFileAttached: true,
          isMinuteEntry: false,
          isOnDocketRecord: false,
          isStricken: false,
          numberOfPages: 11,
          partyPrimary: true,
          partySecondary: false,
          pending: false,
          privatePractitioners: [],
          processingStatus: 'complete',
          receivedAt: '2020-09-18T17:38:31.776Z',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          attachments: false,
          certificateOfService: false,
          certificateOfServiceDate: null,
          createdAt: '2020-09-18T17:38:32.417Z',
          docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
          docketNumber: '169-20',
          documentTitle: 'Proposed Stipulated Decision',
          documentType: 'Proposed Stipulated Decision',
          draftOrderState: null,
          entityName: 'DocketEntry',
          eventCode: 'PSDE',
          filedBy: 'Resp.',
          filingDate: '2020-09-18T17:38:32.418Z',
          hasSupportingDocuments: false,
          index: 3,
          isDraft: false,
          isFileAttached: true,
          isMinuteEntry: false,
          isOnDocketRecord: true,
          isStricken: false,
          numberOfPages: 2,
          partyIrsPractitioner: true,
          pending: true,
          privatePractitioners: [],
          processingStatus: 'complete',
          receivedAt: '2020-09-18T17:38:32.418Z',
          relationship: 'primaryDocument',
          scenario: 'Standard',
          servedAt: '2020-09-18T17:38:32.418Z',
          servedParties: [
            { email: 'petitioner@example.com', name: 'Mona Schultz' },
          ],
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            associatedJudge: 'Chief Judge',
            caseStatus: 'New',
            caseTitle: 'Mona Schultz',
            createdAt: '2020-09-18T17:38:32.418Z',
            docketEntry: {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: null,
              createdAt: '2020-09-18T17:38:32.417Z',
              docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
              docketNumber: '169-20',
              documentTitle: 'Proposed Stipulated Decision',
              documentType: 'Proposed Stipulated Decision',
              entityName: 'DocketEntry',
              eventCode: 'PSDE',
              filedBy: 'Resp.',
              filingDate: '2020-09-18T17:38:32.418Z',
              hasSupportingDocuments: false,
              isDraft: false,
              isFileAttached: true,
              isMinuteEntry: false,
              isOnDocketRecord: true,
              isStricken: false,
              partyIrsPractitioner: true,
              pending: true,
              privatePractitioners: [],
              processingStatus: 'pending',
              receivedAt: '2020-09-18T17:38:32.418Z',
              relationship: 'primaryDocument',
              scenario: 'Standard',
              userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber: '169-20',
            docketNumberWithSuffix: '169-20L',
            entityName: 'WorkItem',
            highPriority: false,
            section: 'docket',
            sentBy: 'Test IRS Practitioner',
            sentByUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            updatedAt: '2020-09-18T17:38:32.418Z',
            workItemId: '5f4eb5ac-099d-4e14-8b26-dfbf1828f0d7',
          },
        },
      ],
      docketNumber: '169-20',
      docketNumberSuffix: 'L',
      docketNumberWithSuffix: '169-20L',
      entityName: 'Case',
      filingType: 'Myself',
      hasPendingItems: true,
      initialCaption: 'Mona Schultz, Petitioner',
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
          email: 'irsPractitioner@example.com',
          entityName: 'IrsPractitioner',
          name: 'Test IRS Practitioner',
          role: 'irsPractitioner',
          serviceIndicator: 'Electronic',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isPaper: false,
      isSealed: false,
      noticeOfAttachments: false,
      noticeOfTrialDate: '2020-09-18T17:38:31.772Z',
      orderDesignatingPlaceOfTrial: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      otherFilers: [],
      otherPetitioners: [],
      partyType: 'Petitioner',
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      petitioners: [
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
      ],
      preferredTrialCity: 'Seattle, Washington',
      privatePractitioners: [],
      procedureType: 'Regular',
      qcCompleteForTrial: {},
      receivedAt: '2020-09-18T17:38:31.772Z',
      sortableDocketNumber: 20000169,
      statistics: [],
      status: 'New',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };

    it("should be true when the case's trial session judge is the currently logged in user", () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...caseDetail,
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
            ...caseDetail,
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
            ...caseDetail,
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
            ...caseDetail,
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
            ...caseDetail,
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
            ...caseDetail,
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
              ...caseDetail,
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
              ...caseDetail,
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
              ...caseDetail,
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

  describe('showBlockedTag', () => {
    it('should be true when blocked is true', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            blocked: true,
            blockedDate: '2019-04-19T17:29:13.120Z',
            blockedReason: 'because',
          },
          ...getBaseState(docketClerkUser),
        },
      });

      expect(result.showBlockedTag).toBeTruthy();
    });

    it('should be true when blocked is false, automaticBlocked is true, and case status is NOT calendared', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            automaticBlocked: true,
            automaticBlockedDate: '2019-04-19T17:29:13.120Z',
            automaticBlockedReason: 'Pending Item',
            status: STATUS_TYPES.new,
          },
          ...getBaseState(docketClerkUser),
        },
      });

      expect(result.showBlockedTag).toBeTruthy();
    });

    it('should be false when blocked is false, automaticBlocked is true, and case status is calendared', () => {
      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            automaticBlocked: true,
            automaticBlockedDate: '2019-04-19T17:29:13.120Z',
            automaticBlockedReason: 'Pending Item',
            status: STATUS_TYPES.calendared,
          },
          ...getBaseState(docketClerkUser),
        },
      });

      expect(result.showBlockedTag).toBeFalsy();
    });
  });
});
