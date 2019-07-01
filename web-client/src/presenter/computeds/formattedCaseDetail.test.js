import { applicationContext } from '../../applicationContext';
import {
  formatYearAmounts,
  formattedCaseDetail as formattedCaseDetailComputed,
} from './formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const constants = {
  DOCUMENT_TYPES_MAP: {
    ownershipDisclosure: 'Ownership Disclosure Statement',
    petitionFile: 'Petition',
  },
};

describe('formattedCaseDetail', () => {
  describe('formatYearAmounts', () => {
    it('does not return 2018 when a blank string is passed in', () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        yearAmounts: [
          {
            amount: '',
            year: '2000',
          },
          {
            amount: '',
            year: '',
          },
        ],
      };
      formatYearAmounts(applicationContext, caseDetail, undefined);
      expect(caseDetail.yearAmountsFormatted).toEqual([
        {
          amount: '',
          amountFormatted: '',
          formattedYear: '2000',
          showError: false,
          year: '2000',
        },
        {
          amount: '',
          amountFormatted: '',
          formattedYear: 'Invalid date',
          showError: false,
          year: '',
        },
      ]);
    });

    it('returns the yearAmount that has year 5000 as an error', () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        yearAmounts: [
          {
            amount: '',
            year: '2000',
          },
          {
            amount: '',
            year: '5000-12-24T00:00:00.000Z',
          },
        ],
      };
      const caseDetailErrors = {
        yearAmounts: [{ index: 1, year: 'year can not be in future' }],
      };
      formatYearAmounts(applicationContext, caseDetail, caseDetailErrors);
      expect(caseDetail.yearAmountsFormatted).toEqual([
        {
          amount: '',
          amountFormatted: '',
          formattedYear: '2000',
          showError: false,
          year: '2000',
        },
        {
          amount: '',
          amountFormatted: '',
          errorMessage: 'year can not be in future',
          formattedYear: '5000',
          showError: true,
          year: '5000',
        },
      ]);
    });

    it('returns duplication errors for the second year Amount on duplicates', () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        yearAmounts: [
          {
            amount: '1000',
            year: '2000',
          },
          {
            amount: '1337',
            year: '2000-12-24T00:00:00.000Z',
          },
        ],
      };
      const caseDetailErrors = {
        yearAmounts: 'Duplicate years are bad',
      };
      formatYearAmounts(applicationContext, caseDetail, caseDetailErrors);
      expect(caseDetail.yearAmountsFormatted).toEqual([
        {
          amount: '1000',
          amountFormatted: '1,000',
          formattedYear: '2000',
          showError: false,
          year: '2000',
        },
        {
          amount: '1337',
          amountFormatted: '1,337',
          errorMessage: 'Duplicate years are bad',
          formattedYear: '2000',
          showError: true,
          year: '2000',
        },
      ]);
    });

    it('sets shouldShowIrsNoticeDate to true when hasIrsNotice is true and hasVerifiedIrsNotice is undefined', async () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        hasIrsNotice: true,
        hasVerifiedIrsNotice: undefined,
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.shouldShowIrsNoticeDate).toBeTruthy();
    });

    it('sets shouldShowIrsNoticeDate and shouldShowYearAmounts to true when hasIrsNotice is true and hasVerifiedIrsNotice is true', async () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        hasIrsNotice: true,
        hasVerifiedIrsNotice: true,
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.shouldShowIrsNoticeDate).toBeTruthy();
      expect(result.shouldShowYearAmounts).toBeTruthy();
    });

    it('sets shouldShowIrsNoticeDate and shouldShowYearAmounts to false when hasIrsNotice is false and hasVerifiedIrsNotice is undefined', async () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        hasIrsNotice: false,
        hasVerifiedIrsNotice: undefined,
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.shouldShowIrsNoticeDate).toBeFalsy();
      expect(result.shouldShowYearAmounts).toBeFalsy();
    });

    it('sets shouldShowIrsNoticeDate and shouldShowYearAmounts to false when hasIrsNotice is false and hasVerifiedIrsNotice is false', async () => {
      const caseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        hasIrsNotice: false,
        hasVerifiedIrsNotice: false,
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.shouldShowIrsNoticeDate).toBeFalsy();
      expect(result.shouldShowYearAmounts).toBeFalsy();
    });
  });

  it('maps docket record dates', async () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
        },
      ],
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants,
      },
    });
    expect(result.docketRecord[0].createdAtFormatted).toEqual('02/28/19');
  });

  it('maps docket record documents', async () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
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
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants,
      },
    });
    expect(result.docketRecordWithDocument[0].document.documentId).toEqual(
      'Petition',
    );
  });

  it('formats docket record document data strings correctly', async () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      contactPrimary: {
        name: 'Bob',
      },
      contactSecondary: {
        name: 'Bill',
      },
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
          partyPrimary: true,
          partyRespondent: true,
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
          partyPractitioner: true,
          partyRespondent: true,
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
      ],
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
      practitioner: { name: 'Test Practitioner' },
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants,
      },
    });
    expect(
      result.docketRecordWithDocument[0].record.filingsAndProceedings,
    ).toEqual('(No Objection)');
    expect(
      result.docketRecordWithDocument[1].record.filingsAndProceedings,
    ).toEqual('(Exhibit(s))');
    expect(
      result.docketRecordWithDocument[2].record.filingsAndProceedings,
    ).toEqual('(C/S 06/07/18) (Exhibit(s)) (Attachment(s)) (Objection)');
    expect(
      result.docketRecordWithDocument[3].record.filingsAndProceedings,
    ).toEqual('(Lodged)');
  });

  describe('sorts docket records', () => {
    let sortedCaseDetail;
    beforeEach(() => {
      sortedCaseDetail = {
        caseCaption: 'Brett Osborne, Petitioner',
        caseId: 'abdc-1234-5678-xyz',
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
        hasIrsNotice: false,
        hasVerifiedIrsNotice: false,
        petitioners: [{ name: 'bob' }],
      };
    });
    it('sorts the docket record in the expected default order (ascending date)', async () => {
      const caseDetail = sortedCaseDetail;
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
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
    it('sorts the docket record by descending date', async () => {
      const caseDetail = sortedCaseDetail;
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.caseId]: 'byDateDesc' },
          },
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

    it('sorts the docket record by ascending index', async () => {
      const caseDetail = sortedCaseDetail;
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.caseId]: 'byIndex' },
          },
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
    it('sorts the docket record by descending index', async () => {
      const caseDetail = sortedCaseDetail;
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
          sessionMetadata: {
            docketRecordSort: { [caseDetail.caseId]: 'byIndexDesc' },
          },
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
    it('should not error if caseCaption does not exist', async () => {
      const caseDetail = {
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.caseName).toEqual('');
    });

    it("should remove ', Petitioner' from caseCaption", async () => {
      const caseDetail = {
        caseCaption: 'Sisqo, Petitioner',
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.caseName).toEqual('Sisqo');
    });

    it("should remove ', Petitioners' from caseCaption", async () => {
      const caseDetail = {
        caseCaption: 'Sisqo and friends,  Petitioners ',
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.caseName).toEqual('Sisqo and friends');
    });

    it("should remove ', Petitioner(s)' from caseCaption", async () => {
      const caseDetail = {
        caseCaption: "Sisqo's entourage,,    Petitioner(s)    ",
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.caseName).toEqual("Sisqo's entourage,");
    });
  });

  describe('practitioner mapping', () => {
    it('should add barnumber into formatted name if available', async () => {
      const caseDetail = {
        caseCaption: 'Sisqo, Petitioner',
        petitioners: [{ name: 'bob' }],
        practitioner: { barNumber: '9999', name: 'Jackie Chan' },
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.practitioner.formattedName).toEqual('Jackie Chan (9999)');
    });
    it('should not add barnumber into formatted name if not available', async () => {
      const caseDetail = {
        caseCaption: 'Sisqo, Petitioner',
        petitioners: [{ name: 'bob' }],
        practitioner: { name: 'Jackie Chan' },
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.practitioner.formattedName).toEqual('Jackie Chan');
    });
  });

  describe('trial detail mapping mapping', () => {
    it('should provide defaults for trial information if no trial session id exists', async () => {
      const caseDetail = {
        petitioners: [{ name: 'bob' }],
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.formattedTrialCity).toEqual('Not assigned');
      expect(result.formattedTrialDate).toEqual('Not scheduled');
      expect(result.formattedTrialJudge).toEqual('Not assigned');
    });

    it('should provide defaults for trial information if no trial session id exists', async () => {
      const caseDetail = {
        petitioners: [{ name: 'bob' }],
        preferredTrialCity: 'England is my City',
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('Not scheduled');
      expect(result.formattedTrialJudge).toEqual('Not assigned');
    });

    it('should format trial information if a trial session id exists', async () => {
      const caseDetail = {
        petitioners: [{ name: 'bob' }],
        trialDate: '2018-12-11T05:00:00Z',
        trialJudge: 'Judge Judy',
        trialLocation: 'England is my City',
        trialSessionId: '123',
        trialTime: '20:30',
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('12/11/18 08:30 pm');
      expect(result.formattedTrialJudge).toEqual('Judge Judy');
    });

    it('should not add time if no time stamp exists', async () => {
      const caseDetail = {
        petitioners: [{ name: 'bob' }],
        trialDate: '2018-12-11T05:00:00Z',
        trialJudge: 'Judge Judy',
        trialLocation: 'England is my City',
        trialSessionId: '123',
      };
      const result = await runCompute(formattedCaseDetail, {
        state: {
          caseDetail,
          caseDetailErrors: {},
          constants,
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('12/11/18');
      expect(result.formattedTrialJudge).toEqual('Judge Judy');
    });
  });
});
