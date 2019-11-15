import { Case } from '../entities/cases/Case';
import { applicationContext } from '../../../../web-client/src/applicationContext';
import {
  formatCase,
  formatCaseDeadlines,
  formatDocument,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketRecords,
} from './getFormattedCaseDetail';

const mockCaseDetailBase = {
  caseId: '123-456-abc-def',
  createdAt: new Date(),
  docketNumber: '123-45',
  docketNumberSuffix: 'S',
  irsSendDate: new Date(),
  payGovDate: new Date(),
  receivedAt: new Date(),
};

const getDateISO = () => new Date().toISOString();

describe('formatCase', () => {
  let mockCaseDetail;

  beforeEach(() => {
    mockCaseDetail = {
      ...mockCaseDetailBase,
    };
  });

  it('should return an empty object if caseDetail is empty', () => {
    const applicationContext = {};
    const caseDetail = {};
    const result = formatCase(applicationContext, caseDetail);

    expect(result).toMatchObject({});
  });

  it('should format documents if the case documents array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          documentId: 'd-1-2-3',
          hi: 'there',
          index: '1',
        },
        {
          documentId: 'd-1-4-3',
          hi: 'there',
          index: '2',
        },
      ],
      documents: [
        {
          createdAt: getDateISO(),
          documentId: 'd-1-2-3',
          documentType: 'Petition',
          eventCode: 'P',
          servedAt: getDateISO(),
          workItems: [
            {
              completedAt: getDateISO(),
              isQC: true,
            },
          ],
        },
        {
          createdAt: getDateISO(),
          documentId: 'd-1-4-3',
          documentType: 'Amended Answer',
          eventCode: 'ABC',
          servedAt: getDateISO(),
          workItems: [
            {
              completedAt: getDateISO(),
              isQC: false,
            },
          ],
        },
      ],
    });
    expect(result.documents[0].isPetition).toBeTruthy();
    expect(result.documents[0].canEdit).toBeFalsy();
    expect(result.documents[0].qcWorkItemsCompleted).toBeTruthy();

    expect(result.documents[0]).toHaveProperty('createdAtFormatted');
    expect(result.documents[0]).toHaveProperty('servedAtFormatted');
    expect(result.documents[0]).toHaveProperty('showServedAt');
    expect(result.documents[0]).toHaveProperty('isStatusServed');
    expect(result.documents[0]).toHaveProperty('isPetition');
    expect(result.documents[0]).toHaveProperty('servedPartiesCode');
  });

  it('should format docket records if the case docket record array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: getDateISO(),
          index: '1',
        },
      ],
    });

    expect(result.docketRecord[0]).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('docketRecordWithDocument');
  });

  it('should format docket records and set createdAtFormatted to the formatted createdAt date if document is not a court-issued document', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: getDateISO(),
          documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          filingDate: getDateISO(),
          index: '1',
        },
      ],
      documents: [
        {
          documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          documentType: 'Petition',
        },
      ],
    });

    expect(result).toHaveProperty('docketRecordWithDocument');
    expect(
      result.docketRecordWithDocument[0].record.createdAtFormatted,
    ).toBeDefined();
  });

  it('should format docket records and set createdAtFormatted to undefined if document is an unserved court-issued document', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: getDateISO(),
          documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          filingDate: getDateISO(),
          index: '1',
        },
      ],
      documents: [
        {
          documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          documentTitle: 'Order [Judge Name] [Anything]',
          documentType: 'OAJ - Order that case is assigned',
          eventCode: 'OAJ',
          scenario: 'Type B',
        },
      ],
    });

    expect(result).toHaveProperty('docketRecordWithDocument');
    expect(
      result.docketRecordWithDocument[0].record.createdAtFormatted,
    ).toBeUndefined();
  });

  it('should format respondents if the respondents array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      respondents: [
        {
          name: 'Test Respondent',
        },
      ],
    });

    expect(result.respondents[0].formattedName).toEqual('Test Respondent');
  });

  it('should format practitioners if the practitioners array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      practitioners: [
        {
          barNumber: 'b1234',
          name: 'Test Practitioner',
        },
      ],
    });

    expect(result.practitioners[0].formattedName).toEqual(
      'Test Practitioner (b1234)',
    );
  });

  it('should format the general properties of case details', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      caseCaption: 'Test Case Caption',
      caseTitle:
        'Test Case Caption, Petitioners v. Internal Revenue, Respondent',
      hasVerifiedIrsNotice: true,
      trialTime: 11,
    });

    expect(result).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('receivedAtFormatted');
    expect(result).toHaveProperty('irsDateFormatted');
    expect(result).toHaveProperty('payGovDateFormatted');
    expect(result.docketNumberWithSuffix).toEqual('123-45S');
    expect(result.irsNoticeDateFormatted).toEqual('No notice provided');
    expect(result.datePetitionSentToIrsMessage).toEqual(
      result.irsDateFormatted,
    );
    expect(result.shouldShowIrsNoticeDate).toBeTruthy();
    expect(result.caseName).toEqual('Test Case Caption');
    expect(result.formattedPreferredTrialCity).toEqual('No location selected');
  });

  it('should apply additional information', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: getDateISO(),
          description: 'desc',
          documentId: 'd-1-2-3',
          index: '1',
        },
      ],
      documents: [
        {
          additionalInfo: 'additional information',
          createdAt: getDateISO(),
          documentId: 'd-1-2-3',
          documentType: 'Petition',
          servedAt: getDateISO(),
        },
      ],
    });

    expect(result.docketRecord[0].description).toEqual(
      'desc additional information',
    );
  });

  it('should format certificate of service date', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: getDateISO(),
          documentId: 'd-1-2-3',
          index: '1',
        },
      ],
      documents: [
        {
          certificateOfServiceDate: getDateISO(),
          createdAt: getDateISO(),
          documentId: 'd-1-2-3',
          documentType: 'Petition',
          servedAt: getDateISO(),
        },
      ],
    });

    expect(result.documents[0].certificateOfServiceDateFormatted).toEqual(
      applicationContext
        .getUtilities()
        .formatDateString(getDateISO(), 'MMDDYY'),
    );
  });

  it('should format irs notice date', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      irsNoticeDate: getDateISO(),
    });

    expect(result.irsNoticeDateFormatted).toEqual(
      applicationContext
        .getUtilities()
        .formatDateString(getDateISO(), 'MMDDYY'),
    );
  });

  it("should return 'No notice provided' when there is no irs notice date", () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
    });

    expect(result.irsNoticeDateFormatted).toEqual('No notice provided');
  });

  it('should format blockedDate when blocked is true', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      blocked: true,
      blockedDate: getDateISO(),
    });

    expect(result.blockedDateFormatted).toEqual(
      applicationContext
        .getUtilities()
        .formatDateString(getDateISO(), 'MMDDYY'),
    );
  });

  it('should format trial details if case status is calendared', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      status: Case.STATUS_TYPES.calendared,
      trialDate: '2011-11-11',
      trialLocation: 'Boise, Idaho',
      trialSessionId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
      trialTime: '11',
    });

    expect(result).toMatchObject({
      formattedAssociatedJudge: 'Not assigned',
      formattedTrialCity: 'Boise, Idaho',
      formattedTrialDate: '11/11/11 11:00 am',
      showTrialCalendared: true,
    });
    expect(result).not.toHaveProperty('showBlockedFromTrial');
    expect(result).not.toHaveProperty('showNotScheduled');
    expect(result).not.toHaveProperty('showScheduled');
  });

  it('should format trial details if case status is not calendared but the case has a trialSessionId', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      trialDate: '2011-11-11',
      trialLocation: 'Boise, Idaho',
      trialSessionId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
      trialTime: '11',
    });

    expect(result).toMatchObject({
      formattedAssociatedJudge: 'Not assigned',
      formattedTrialCity: 'Boise, Idaho',
      formattedTrialDate: '11/11/11 11:00 am',
      showScheduled: true,
    });
    expect(result).not.toHaveProperty('showTrialCalendared');
    expect(result).not.toHaveProperty('showBlockedFromTrial');
    expect(result).not.toHaveProperty('showNotScheduled');
  });

  it('should format trial details with incomplete trialDate information', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      status: Case.STATUS_TYPES.calendared,
      trialDate: undefined,
      trialLocation: 'Boise, Idaho',
      trialSessionId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
    });

    expect(result).toMatchObject({
      formattedTrialDate: 'Not scheduled',
    });
  });

  it('should show not scheduled section if case status is not calendared and case is not blocked', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
    });

    expect(result).toMatchObject({
      showNotScheduled: true,
    });
  });
});

describe('formatCaseDeadlines', () => {
  it('should call formatCaseDeadline on the given array', () => {
    const result = formatCaseDeadlines(applicationContext, [
      {
        deadlineDate: getDateISO(),
      },
      {
        deadlineDate: getDateISO(),
      },
    ]);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toHaveProperty('deadlineDateFormatted');
  });

  it('should set the caseDeadline to overdue if the deadlineDate is before today', () => {
    const result = formatCaseDeadlines(applicationContext, [
      {
        deadlineDate: '2017-01-01T00:01:02Z',
      },
      {
        deadlineDate: getDateISO(),
      },
    ]);
    expect(result[0]).toHaveProperty('overdue');
    expect(result[0]).toBeTruthy();
  });
});

describe('formatDocument', () => {
  it('should format the servedAt date', () => {
    const results = formatDocument(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
    });
    expect(results).toMatchObject({
      servedAtFormatted: '03/27/19 05:53 pm',
    });
  });

  it('should set the servedPartiesCode to `B` if status is served, servedAt date exists, and servedParties is an array', () => {
    const results = formatDocument(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
      servedParties: ['someone', 'someone else'],
      status: 'served',
    });
    expect(results).toMatchObject({
      servedPartiesCode: 'B',
    });
  });
});

describe('getFilingsAndProceedings', () => {
  it('returns a value based on document properties (attachments, C/S, exhibits, objections, and lodged)', () => {
    const result = getFilingsAndProceedings({
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDateFormatted: '11/12/1999',
      exhibits: true,
      lodged: true,
      objections: 'Yes',
    });

    expect(result).toEqual(
      '(C/S 11/12/1999) (Exhibit(s)) (Attachment(s)) (Objection) (Lodged)',
    );
  });
});

describe('getFormattedCaseDetail', () => {
  it('should call formatCase and add additional details on the given case', () => {
    const result = getFormattedCaseDetail({
      applicationContext,
      caseDeadlines: [
        {
          deadlineDate: getDateISO(),
        },
      ],
      caseDetail: { ...mockCaseDetailBase },
      docketRecordSort: 'byDate',
    });

    expect(result).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('docketRecordWithDocument');
    expect(result).toHaveProperty('docketRecordSort');
    expect(result).toHaveProperty('caseDeadlines');
  });

  it('should format draft documents', () => {
    const result = getFormattedCaseDetail({
      applicationContext,
      caseDetail: {
        ...mockCaseDetailBase,
        docketRecord: [],
        documents: [
          {
            archived: false,
            createdAt: getDateISO(),
            documentId: 'd-1-2-3',
            documentType: 'Order',
          },
        ],
      },
      docketRecordSort: 'byDate',
    });

    expect(result.draftDocuments[0]).toHaveProperty('signUrl');
    expect(result.draftDocuments[0]).toHaveProperty('editUrl');
    expect(result.draftDocuments[0]).toHaveProperty('signedAtFormatted');
  });
});

describe('sortDocketRecords', () => {
  it('should sort docket records by date by default', () => {
    // following dates selected to ensure test coverage of 'dateStringsCompared'
    const result = sortDocketRecords(
      [
        {
          index: '2',
          record: {
            filingDate: '2019-07-08',
          },
        },
        {
          index: '1',
          record: {
            filingDate: '2019-08-03T00:06:44.000Z',
          },
        },
        {
          index: '4',
          record: {
            filingDate: '2019-07-08T00:01:19.000Z',
          },
        },
        {
          index: '3',
          record: {
            filingDate: '2017-01-01T00:01:02.025Z',
          },
        },
        {
          index: '5',
          record: {
            filingDate: '2017-01-01T00:01:12.025Z',
          },
        },
      ],
      'Desc',
    );

    expect(result[0].index).toEqual('1');
  });

  it('should sort docket records by index when sortBy is byIndex', () => {
    const result = sortDocketRecords(
      [
        {
          index: '2',
          record: {
            filingDate: getDateISO(),
          },
        },
        {
          index: '3',
          record: {
            filingDate: getDateISO(),
          },
        },
        {
          index: '1',
          record: {
            filingDate: getDateISO(),
          },
        },
      ],
      'byIndex',
    );

    expect(result[1].index).toEqual('2');
  });

  it('should sort docket records in reverse if Desc is included in sortBy', () => {
    const result = sortDocketRecords(
      [
        {
          index: '2',
          record: {
            filingDate: getDateISO(),
          },
        },
        {
          index: '3',
          record: {
            filingDate: getDateISO(),
          },
        },
        {
          index: '1',
          record: {
            filingDate: getDateISO(),
          },
        },
      ],
      'byIndexDesc',
    );

    expect(result[0].index).toEqual('3');
  });
});
