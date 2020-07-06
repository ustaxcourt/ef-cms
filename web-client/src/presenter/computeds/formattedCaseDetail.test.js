import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from './formattedCaseDetail';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let globalUser;

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
  role: ROLES.petitionsClerk,
  userId: '123',
};
const docketClerkUser = {
  role: ROLES.docketClerk,
  userId: '234',
};
const petitionerUser = {
  role: ROLES.petitioner,
  userId: '456',
};

describe('formattedCaseDetail', () => {
  it('does not error and returns expected empty values on empty caseDetail', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {},
      },
    });
    expect(result).toMatchObject({
      caseDeadlines: [],
      docketRecordWithDocument: [],
    });
  });

  it('maps docket record dates', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
        },
      ],
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
    expect(result.docketRecord[0].createdAtFormatted).toEqual('02/28/19');
  });

  it('maps docket record documents', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
      docketRecord: [
        {
          description: 'Petition',
          documentId: 'Petition',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
        },
      ],
      documents: [
        {
          createdAt: '2019-02-28T21:14:39.488Z',
          documentId: 'Petition',
          documentType: 'Petition',
          showValidationInput: '2019-02-28T21:14:39.488Z',
          status: 'served',
        },
      ],
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
    expect(result.docketRecordWithDocument[0].document.documentId).toEqual(
      'Petition',
    );
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
      docketRecord: [
        {
          description: 'Amended Petition',
          documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          filingDate: '2019-04-19T17:29:13.120Z',
        },
        {
          description:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          filingDate: '2019-04-19T17:31:09.515Z',
        },
        {
          description:
            'Motion for Leave to File Computation for Entry of Decision',
          documentId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
          filingDate: '2019-04-19T17:39:10.476Z',
        },
        {
          description:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          filingDate: '2019-04-19T17:42:13.122Z',
        },
      ],
      documents: [
        {
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          createdAt: '2019-04-19T17:29:13.120Z',
          documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: 'No',
          partyPrimary: true,
          relationship: 'primaryDocument',
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        {
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          partyIrsPractitioner: true,
          partyPrimary: true,
          previousDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          relationship: 'primaryDocument',
          scenario: 'Nonstandard F',
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
          documentId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
          documentTitle:
            'Motion for Leave to File Computation for Entry of Decision',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          exhibits: true,
          hasSecondarySupportingDocuments: false,
          hasSupportingDocuments: true,
          objections: 'Yes',
          partyPrimary: true,
          partySecondary: true,
          relationship: 'primaryDocument',
          scenario: 'Nonstandard H',
          secondarySupportingDocument: null,
          secondarySupportingDocumentFreeText: null,
          supportingDocument: 'Declaration in Support',
          supportingDocumentFreeText: 'Rachael',
        },
        {
          additionalInfo: 'Additional Info',
          additionalInfo2: 'Additional Info2',
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
      ],
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
    expect(result.docketRecordWithDocument).toMatchObject([
      {
        record: {
          description: 'Amended Petition',
          filingsAndProceedings: '(No Objection)',
        },
      },
      {
        record: {
          description:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          filingsAndProceedings: '(Exhibit(s))',
        },
      },
      {
        record: {
          description:
            'Motion for Leave to File Computation for Entry of Decision',
          filingsAndProceedings:
            '(C/S 06/07/18) (Exhibit(s)) (Attachment(s)) (Objection)',
        },
      },
      {
        record: {
          description:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition Additional Info',
          filingsAndProceedings: '(Lodged)',
        },
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
        description:
          'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition Additional Info',
        filingsAndProceedingsWithAdditionalInfo: ' (Lodged) Additional Info2',
        isInProgress: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      },
    ]);
  });

  describe('sorts docket records', () => {
    let sortedCaseDetail;
    beforeAll(() => {
      sortedCaseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        caseId: 'abdc-1234-5678-xyz',
        correspondence: [],
        docketRecord: [
          {
            description: 'Petition',
            documentId: 'Petition',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28T21:10:55.488Z',
            index: 1,
          },
          {
            description: 'Request for Place of Trial',
            documentId: null,
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28T21:10:33.488Z',
            index: 2,
          },
          {
            description: 'Ownership Disclosure Statement',
            documentId: 'Ownership Disclosure Statement',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-03-28T21:14:39.488Z',
            index: 4,
          },
          {
            description: 'Other',
            documentId: 'Other',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-01-28',
            index: 3,
          },
        ],
        documents: [
          {
            createdAt: '2019-02-28T21:14:39.488Z',
            documentId: 'Petition',
            documentType: 'Petition',
            showValidationInput: '2019-02-28T21:14:39.488Z',
            status: 'served',
          },
          {
            createdAt: '2019-03-28T21:14:39.488Z',
            documentId: 'Ownership Disclosure Statement',
            documentType: 'Ownership Disclosure Statement',
            showValidationInput: '2019-03-28T21:14:39.488Z',
            status: 'served',
          },
          {
            createdAt: '2019-01-01T21:14:39.488Z',
            documentId: 'Other',
            documentType: 'Other',
            showValidationInput: '2019-01-01T21:14:39.488Z',
            status: 'served',
          },
        ],
        hasVerifiedIrsNotice: false,
        petitioners: [{ name: 'bob' }],
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
      expect(result.docketRecordWithDocument[0]).toMatchObject({
        document: {
          documentType: 'Petition',
        },
      });
      expect(result.docketRecordWithDocument[1]).toMatchObject({
        record: {
          description: 'Request for Place of Trial',
        },
      });
      expect(result.docketRecordWithDocument[2]).toMatchObject({
        document: {
          documentType: 'Other',
        },
      });
      expect(result.docketRecordWithDocument[3]).toMatchObject({
        document: {
          documentType: 'Ownership Disclosure Statement',
        },
      });
    });
    it('sorts the docket record by descending date', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.caseId]: 'byDateDesc' },
          },
          validationErrors: {},
        },
      });
      expect(result.docketRecordWithDocument[3]).toMatchObject({
        document: {
          documentType: 'Petition',
        },
      });
      expect(result.docketRecordWithDocument[2]).toMatchObject({
        record: {
          description: 'Request for Place of Trial',
        },
      });
      expect(result.docketRecordWithDocument[1]).toMatchObject({
        document: {
          documentType: 'Other',
        },
      });
      expect(result.docketRecordWithDocument[0]).toMatchObject({
        document: {
          documentType: 'Ownership Disclosure Statement',
        },
      });
    });

    it('sorts the docket record by ascending index', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.caseId]: 'byIndex' },
          },
          validationErrors: {},
        },
      });
      expect(result.docketRecordWithDocument[0]).toMatchObject({
        document: {
          documentType: 'Petition',
        },
      });
      expect(result.docketRecordWithDocument[1]).toMatchObject({
        record: {
          description: 'Request for Place of Trial',
        },
      });
      expect(result.docketRecordWithDocument[3]).toMatchObject({
        document: {
          documentType: 'Ownership Disclosure Statement',
        },
      });
      expect(result.docketRecordWithDocument[2]).toMatchObject({
        document: {
          documentType: 'Other',
        },
      });
    });
    it('sorts the docket record by descending index', () => {
      const caseDetail = sortedCaseDetail;
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.caseId]: 'byIndexDesc' },
          },
          validationErrors: {},
        },
      });
      expect(result.docketRecordWithDocument[0]).toMatchObject({
        record: {
          description: 'Ownership Disclosure Statement',
        },
      });
      expect(result.docketRecordWithDocument[1]).toMatchObject({
        record: {
          description: 'Other',
        },
      });
      expect(result.docketRecordWithDocument[2]).toMatchObject({
        record: {
          description: 'Request for Place of Trial',
        },
      });
      expect(result.docketRecordWithDocument[3]).toMatchObject({
        record: {
          description: 'Petition',
        },
      });
    });
  });

  describe('case name mapping', () => {
    it('should not error if caseCaption does not exist', () => {
      const caseDetail = {
        correspondence: [],
        petitioners: [{ name: 'bob' }],
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
        petitioners: [{ name: 'bob' }],
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
        petitioners: [{ name: 'bob' }],
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
        petitioners: [{ name: 'bob' }],
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
        petitioners: [{ name: 'bob' }],
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
        correspondence: [],
        petitioners: [{ name: 'bob' }],
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
        correspondence: [],
        petitioners: [{ name: 'bob' }],
        status: CASE_STATUS_TYPES.calendared,
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
        petitioners: [{ name: 'bob' }],
        status: CASE_STATUS_TYPES.calendared,
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
        petitioners: [{ name: 'bob' }],
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
        petitioners: [{ name: 'bob' }],
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
        correspondence: [],
        petitioners: [{ name: 'bob' }],
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
      caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        correspondence: [],
        docketRecord: [
          {
            description: 'Petition',
            documentId: 'Petition',
            filedBy: 'Jessica Frase Marine',
            filingDate: '2019-02-28T21:14:39.488Z',
          },
        ],
        documents: [
          {
            createdAt: '2019-02-28T21:14:39.488Z',
            documentId: 'Petition',
            documentType: 'Petition',
            showValidationInput: '2019-02-28T21:14:39.488Z',
            status: 'served',
          },
          {
            archived: false,
            createdAt: '2019-02-28T21:14:39.488Z',
            documentId: 'd-1-2-3',
            documentTitle: 'Order to do something',
            documentType: 'Order',
          },
          {
            archived: false,
            createdAt: '2019-02-28T21:14:39.488Z',
            documentId: 'd-2-3-4',
            documentTitle: 'Stipulated Decision',
            documentType: 'Stipulated Decision',
          },
        ],
        hasVerifiedIrsNotice: false,
        petitioners: [{ name: 'bob' }],
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
          isNotServedCourtIssuedDocument: true,
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
          isNotServedCourtIssuedDocument: true,
          isPetition: false,
          isStatusServed: false,
          showDocumentViewerLink: true,
          signedAtFormatted: undefined,
          signedAtFormattedTZ: undefined,
        },
      ]);
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
            petitioners: [{ name: 'Bobby Flay' }],
            status: CASE_STATUS_TYPES.calendared,
            trialDate: '2018-12-11T05:00:00Z',
            trialLocation: 'Flavortown',
            trialSessionId: '123',
          },
        ],
        correspondence: [],
        petitioners: [{ name: 'bob' }],
        status: CASE_STATUS_TYPES.calendared,
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
        petitioners: [{ name: 'bob' }],
        status: CASE_STATUS_TYPES.calendared,
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
        docketRecord: [
          {
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
          {
            description: 'Filing Fee Paid',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
          {
            description: 'System Generated',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
          {
            description: 'Court Issued - Not Served',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
          {
            description: 'Court Issued - Served',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
        ],
        documents: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            workItems: [{ isQC: true }],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            documentTitle: 'System Generated',
            documentType: 'Notice of Trial',
            eventCode: 'NDT',
            workItems: [{ isQC: true }],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            documentTitle: 'Court Issued - Not Served',
            documentType: 'Order',
            eventCode: 'O',
            isCourtIssuedDocument: true,
            workItems: [
              { completedAt: '2019-06-19T17:29:13.120Z', isQC: false },
            ],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            documentTitle: 'Court Issued - Served',
            documentType: 'Order',
            eventCode: 'O',
            isCourtIssuedDocument: true,
            servedAt: '2019-06-19T17:29:13.120Z',
            status: 'served',
            workItems: [
              { completedAt: '2019-06-19T17:29:13.120Z', isQC: false },
            ],
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
      ).toEqual(false);
    });

    it('should not show the edit button if the user does not have permission', () => {
      caseDetail.documents[0].workItems[0].completedAt =
        '2019-06-19T17:29:13.120Z';

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
      caseDetail.documents[0].workItems[0].completedAt =
        '2019-06-19T17:29:13.120Z';

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
        result.formattedDocketEntries[2].showEditDocketRecordEntry,
      ).toEqual(false);
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
        result.formattedDocketEntries[3].showEditDocketRecordEntry,
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
        result.formattedDocketEntries[4].showEditDocketRecordEntry,
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
        docketRecord: [
          {
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            filingDate: '2019-06-19T17:29:13.120Z',
            numberOfPages: 24,
          },
          {
            description: 'Filing Fee Paid',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
          {
            description: 'System Generated',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            filingDate: '2019-06-19T17:29:13.120Z',
            numberOfPages: 2,
          },
          {
            description: 'Court Issued - Not Served',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            filingDate: '2019-06-19T17:29:13.120Z',
            numberOfPages: 7,
          },
          {
            description: 'Court Issued - Served',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
        ],
        documents: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            workItems: [{ isQC: true }],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            documentTitle: 'System Generated',
            documentType: 'Notice of Trial',
            eventCode: 'NDT',
            workItems: [{ isQC: true }],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            documentTitle: 'Court Issued - Not Served',
            documentType: 'Order',
            eventCode: 'O',
            isCourtIssuedDocument: true,
            workItems: [
              { completedAt: '2019-06-19T17:29:13.120Z', isQC: false },
            ],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            documentTitle: 'Court Issued - Served',
            documentType: 'Order',
            eventCode: 'O',
            isCourtIssuedDocument: true,
            numberOfPages: 9,
            servedAt: '2019-06-19T17:29:13.120Z',
            status: 'served',
            workItems: [
              { completedAt: '2019-06-19T17:29:13.120Z', isQC: false },
            ],
          },
        ],
      };
    });

    it('should show number of pages from the docket record with a mapped document', () => {
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

      expect(result.formattedDocketEntries[4].numberOfPages).toEqual(9);
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
        docketRecord: [
          {
            description: 'Motion to Dismiss for Lack of Jurisdiction',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            filingDate: '2019-06-19T17:29:13.120Z',
            isLegacy: true,
            isStricken: true,
            numberOfPages: 24,
          },
          {
            description: 'Filing Fee Paid',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
          {
            description: 'System Generated',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            filingDate: '2019-06-19T17:29:13.120Z',
            numberOfPages: 2,
          },
          {
            description: 'Court Issued - Not Served',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            filingDate: '2019-06-19T17:29:13.120Z',
            numberOfPages: 7,
          },
          {
            description: 'Court Issued - Served',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            filingDate: '2019-06-19T17:29:13.120Z',
          },
        ],
        documents: [
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
            documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
            documentType: 'Motion to Dismiss for Lack of Jurisdiction',
            eventCode: 'M073',
            workItems: [{ isQC: true }],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '70094dbb-72bf-481e-a592-8d50dad7ffa9',
            documentTitle: 'System Generated',
            documentType: 'Notice of Trial',
            eventCode: 'NDT',
            workItems: [{ isQC: true }],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '80094dbb-72bf-481e-a592-8d50dad7ffa0',
            documentTitle: 'Court Issued - Not Served',
            documentType: 'Order',
            eventCode: 'O',
            isCourtIssuedDocument: true,
            workItems: [
              { completedAt: '2019-06-19T17:29:13.120Z', isQC: false },
            ],
          },
          {
            attachments: false,
            certificateOfService: false,
            createdAt: '2019-06-19T17:29:13.120Z',
            documentId: '90094dbb-72bf-481e-a592-8d50dad7ffa1',
            documentTitle: 'Court Issued - Served',
            documentType: 'Order',
            eventCode: 'O',
            isCourtIssuedDocument: true,
            numberOfPages: 9,
            servedAt: '2019-06-19T17:29:13.120Z',
            status: 'served',
            workItems: [
              { completedAt: '2019-06-19T17:29:13.120Z', isQC: false },
            ],
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
});
