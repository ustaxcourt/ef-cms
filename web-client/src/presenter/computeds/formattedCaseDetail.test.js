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

const getDateISO = () => new Date().toISOString();

describe('formattedCaseDetail', () => {
  let globalUser;
  const {
    DOCUMENT_RELATIONSHIPS,
    OBJECTIONS_OPTIONS_MAP,
    STATUS_TYPES,
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
    userId: '123',
  };
  const docketClerkUser = {
    role: USER_ROLES.docketClerk,
    userId: '234',
  };
  const petitionerUser = {
    role: USER_ROLES.petitioner,
    userId: '456',
  };

  const simpleDocketEntries = [
    {
      createdAt: getDateISO(),
      description: 'Petition',
      documentId: '123',
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
      description: 'Amended Petition',
      documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
      documentTitle: 'Amended Petition',
      documentType: 'Amended Petition',
      eventCode: 'PAP',
      exhibits: false,
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
      description:
        'First Amended Unsworn Declaration under Penalty of Perjury in Support',
      documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
      documentTitle:
        'First Amended Unsworn Declaration under Penalty of Perjury in Support',
      documentType: 'Amended',
      eventCode: 'ADED',
      exhibits: true,
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
      description: 'Motion for Leave to File Computation for Entry of Decision',
      documentId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
      documentTitle:
        'Motion for Leave to File Computation for Entry of Decision',
      documentType: 'Motion for Leave to File',
      eventCode: 'M115',
      exhibits: true,
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
      additionalInfo: 'Additional Info',
      additionalInfo2: 'Additional Info2',
      category: 'Supporting Document',
      createdAt: '2019-04-19T17:29:13.122Z',
      description:
        'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
      documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
      description: 'Hearing Exhibits for asdfasdfasdf',
      documentId: '42b49268-81d3-4b92-81c3-f1edc26ca844',
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
          contactPrimary: {},
          docketEntries: [],
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
      contactPrimary: {},
      correspondence: [],
      docketEntries: simpleDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
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
      contactPrimary: {},
      correspondence: [],
      docketEntries: simpleDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        validationErrors: {},
      },
    });
    expect(result.formattedDocketEntries[0].documentId).toEqual('123');
  });

  it('formats docket record document data strings and descriptions and docket entry fields correctly', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      contactPrimary: {
        name: 'Bob',
      },
      contactSecondary: {
        name: 'Bill',
      },
      correspondence: [],
      docketEntries: complexDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
      privatePractitioners: [{ name: 'Test Practitioner' }],
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
        description: 'Amended Petition',
        filingsAndProceedings: '(No Objection)',
      },
      {
        description:
          'First Amended Unsworn Declaration under Penalty of Perjury in Support',
        filingsAndProceedings: '(Exhibit(s))',
      },
      {
        description:
          'Motion for Leave to File Computation for Entry of Decision',
        filingsAndProceedings:
          '(C/S 06/07/18) (Exhibit(s)) (Attachment(s)) (Objection)',
      },
      {
        description:
          'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition Additional Info',
        filingsAndProceedings: '(Lodged)',
      },
      {
        description: 'Hearing Exhibits for asdfasdfasdf',
        filingsAndProceedings: '',
      },
    ]);

    expect(result.formattedDocketEntries).toMatchObject([
      {
        description: 'Amended Petition',
        filingsAndProceedingsWithAdditionalInfo: ' (No Objection)',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
      {
        description:
          'First Amended Unsworn Declaration under Penalty of Perjury in Support',
        filingsAndProceedingsWithAdditionalInfo: ' (Exhibit(s))',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
      {
        description:
          'Motion for Leave to File Computation for Entry of Decision',
        filingsAndProceedingsWithAdditionalInfo:
          ' (C/S 06/07/18) (Exhibit(s)) (Attachment(s)) (Objection)',
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
        description: 'Hearing Exhibits for asdfasdfasdf',
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

  describe('createdAtFormatted', () => {
    const baseCaseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      contactPrimary: {
        name: 'Bob',
      },
      contactSecondary: {
        name: 'Bill',
      },
      correspondence: [],
      hasVerifiedIrsNotice: false,
      privatePractitioners: [],
    };

    const baseDocument = {
      createdAt: '2019-04-19T17:29:13.120Z',
      description: 'Amended Petition',
      documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
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
      contactPrimary: {
        name: 'Bob',
      },
      correspondence: [],
      docketEntries: [
        {
          description: 'Motion for Leave to File Administrative Record',
          documentId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
          documentType: 'Motion for Leave to File Administrative Record',
          eventCode: 'M115',
          filingDate: '2020-07-08T16:33:41.180Z',
          lodged: true,
        },
        {
          description: 'Motion for Leave to File Administrative Record',
          documentId: '5d96bdfd-dc10-40db-b640-ef10c2591b6b',
          documentType: 'Motion for Leave to File Administrative Record',
          eventCode: 'M115',
          filingDate: '2020-07-08T16:33:41.180Z',
          lodged: false,
        },
      ],
      petitioners: [{ name: 'bob' }],
      privatePractitioners: [{ name: 'Test Practitioner' }],
    };

    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        validationErrors: {},
      },
    });

    const lodgedDocument = result.formattedDocketEntries.find(
      d => d.documentId === '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
    );
    const unlodgedDocument = result.formattedDocketEntries.find(
      d => d.documentId === '5d96bdfd-dc10-40db-b640-ef10c2591b6b',
    );

    expect(lodgedDocument.eventCode).toEqual('MISCL');
    expect(unlodgedDocument.eventCode).not.toEqual('MISCL');
  });

  describe('sorts docket records', () => {
    let sortedCaseDetail;

    beforeAll(() => {
      sortedCaseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary: {},
        correspondence: [],
        docketEntries: [
          {
            createdAt: '2019-02-28T21:14:39.488Z',
            description: 'Petition',
            documentId: 'Petition',
            documentType: 'Petition',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28T21:10:55.488Z',
            index: 1,
            isOnDocketRecord: true,
            showValidationInput: '2019-02-28T21:14:39.488Z',
            status: 'served',
          },
          {
            description: 'Request for Place of Trial',
            documentId: 'Request for Place of Trial',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28T21:10:33.488Z',
            index: 2,
            isOnDocketRecord: true,
          },
          {
            createdAt: '2019-03-28T21:14:39.488Z',
            description: 'Ownership Disclosure Statement',
            documentId: 'Ownership Disclosure Statement',
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
            description: 'Other',
            documentId: 'Other',
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
        description: 'Request for Place of Trial',
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
        documentType: 'Petition',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        description: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        documentType: 'Other',
      });
      expect(result.formattedDocketEntries[0]).toMatchObject({
        documentType: 'Ownership Disclosure Statement',
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
        documentType: 'Petition',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        description: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[3]).toMatchObject({
        documentType: 'Ownership Disclosure Statement',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        documentType: 'Other',
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
        description: 'Ownership Disclosure Statement',
      });
      expect(result.formattedDocketEntries[1]).toMatchObject({
        description: 'Other',
      });
      expect(result.formattedDocketEntries[2]).toMatchObject({
        description: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntries[3]).toMatchObject({
        description: 'Petition',
      });
    });
  });

  describe('case name mapping', () => {
    it('should not error if caseCaption does not exist', () => {
      const caseDetail = {
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
        privatePractitioners: [{ barNumber: '9999', name: 'Jackie Chan' }],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
        privatePractitioners: [{ name: 'Jackie Chan' }],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
      };
      const caseDeadlines = [
        {
          deadlineDate: new Date(),
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
          documentId: 'Petition',
          documentType: 'Petition',
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
          documentId: 'd-1-2-3',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          isDraft: true,
          isOnDocketRecord: false,
        },
        {
          archived: false,
          createdAt: '2019-02-28T21:14:39.488Z',
          documentId: 'd-2-3-4',
          documentTitle: 'Stipulated Decision',
          documentType: 'Stipulated Decision',
          isDraft: true,
          isOnDocketRecord: false,
        },
      ];

      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary: {},
        correspondence: [],
        docketEntries,
        hasVerifiedIrsNotice: false,
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
          documentId: 'd-1-2-3',
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
          documentId: 'd-2-3-4',
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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
        contactPrimary: {},
        correspondence: [],
        docketEntries: [],
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

  describe('showEditDocketRecordEntry', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary: {
          name: 'Bob',
        },
        correspondence: [],
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            filingDate: '2019-06-19T17:29:13.120Z',
            index: 1,
            isOnDocketRecord: true,
            workItem: {},
          },
          {
            description: 'Filing Fee Paid',
            eventCode: 'FEE',
            filingDate: '2019-06-20T17:29:13.120Z',
            index: 2,
            isMinuteEntry: true,
            isOnDocketRecord: true,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'System Generated',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            documentTitle: 'System Generated',
            documentType: 'Notice of Trial',
            eventCode: 'NTD',
            filingDate: '2019-06-21T17:29:13.120Z',
            isOnDocketRecord: true,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Not Served',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            documentTitle: 'Court Issued - Not Served',
            documentType: 'Order',
            eventCode: 'O',
            filingDate: '2019-06-22T17:29:13.120Z',
            isCourtIssuedDocument: true,
            isOnDocketRecord: true,
            workItem: { completedAt: '2019-06-19T17:29:13.120Z' },
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Served',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
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
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Court Issued - Unservable',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa9',
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
      };
    });

    it('should not show the edit button if the docket entry document has not been QCed', () => {
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

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toBeFalsy();
    });

    it('should not show the edit button if the user does not have permission', () => {
      caseDetail.docketEntries[0].workItem = {
        completedAt: '2019-06-19T17:29:13.120Z',
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          permissions: {
            EDIT_DOCKET_ENTRY: false,
          },
          validationErrors: {},
        },
      });

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toEqual(false);
    });

    it('should show the edit button if the docket entry document is QCed and the user has permission', () => {
      caseDetail.docketEntries[0].workItem = {
        completedAt: '2019-06-19T17:29:13.120Z',
      };

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

      expect(
        result.formattedDocketEntries[0].showEditDocketRecordEntry,
      ).toEqual(true);
    });

    it('should show the edit button if the docket entry has no document and the user has permission', () => {
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

      expect(
        result.formattedDocketEntries[1].showEditDocketRecordEntry,
      ).toEqual(true);
    });

    it('should not show the edit button if the docket entry has a system generated document', () => {
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

      expect(
        result.formattedDocketEntries[4].showEditDocketRecordEntry,
      ).toBeFalsy();
    });

    it('should NOT show the edit button if the docket entry has an unserved court issued document', () => {
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

      expect(
        result.formattedDocketEntries[5].showEditDocketRecordEntry,
      ).toEqual(false);
    });

    it('should show the edit button if the docket entry has a served court issued document', () => {
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

      expect(
        result.formattedDocketEntries[2].showEditDocketRecordEntry,
      ).toEqual(true);
    });

    it('should should the edit button if the document is an unservable court issued document', () => {
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

      expect(
        result.formattedDocketEntries[3].showEditDocketRecordEntry,
      ).toEqual(true);
    });
  });

  describe('showEditDocketRecordEntry', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary: {
          name: 'Bob',
        },
        correspondence: [],
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
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
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
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
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
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
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
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

  describe('stricken docket record', () => {
    let caseDetail;

    beforeAll(() => {
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary: {
          name: 'Bob',
        },
        correspondence: [],
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            filingDate: '2019-06-19T17:29:13.120Z',
            isFileAttached: true,
            isLegacy: true,
            isOnDocketRecord: true,
            isStricken: true,
            numberOfPages: 24,
          },
          {
            description: 'Filing Fee Paid',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffb1',
            filingDate: '2019-06-19T17:29:13.120Z',
            isFileAttached: false,
            isOnDocketRecord: true,
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'System Generated',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
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
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
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
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
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
      contactPrimary = baseContact;
      contactSecondary = baseContact;
      otherPetitioners = [baseContact];
      otherFilers = [baseContact];

      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary,
        contactSecondary,
        correspondence: [],
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            filingDate: '2019-06-19T17:29:13.120Z',
            isLegacy: true,
            isStricken: true,
            numberOfPages: 24,
          },
        ],
        otherFilers,
        otherPetitioners,
      };
    });

    it('sets the showEAccessFlag to false for internal users when a contact does not have legacy access', () => {
      baseContact.hasEAccess = false;

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
    let contactPrimary;
    let contactSecondary;
    let otherPetitioners;
    let otherFilers;
    let caseDetail;

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
        contactPrimary,
        contactSecondary,
        correspondence: [],
        docketEntries: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
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

  describe('formattedOpenCases', () => {
    it('should return formatted open cases', () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        contactPrimary: {},
        correspondence: [],
        createdAt: '2020-02-02T17:29:13.120Z',
        docketEntries: simpleDocketEntries,
        hasVerifiedIrsNotice: false,
        petitioners: [{ name: 'bob' }],
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
        contactPrimary: {},
        correspondence: [],
        createdAt: '2020-02-02T17:29:13.120Z',
        docketEntries: simpleDocketEntries,
        hasVerifiedIrsNotice: false,
        petitioners: [{ name: 'bob' }],
      };

      const result = runCompute(formattedClosedCases, {
        state: {
          closedCases: [caseDetail],
        },
      });

      expect(result).toMatchObject([{ createdAtFormatted: '02/02/20' }]);
    });
  });
});
