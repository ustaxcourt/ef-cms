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
    expect(result.documents[0].qcWorkItemsUntouched).toEqual(false);

    expect(result.documents[0]).toHaveProperty('createdAtFormatted');
    expect(result.documents[0]).toHaveProperty('servedAtFormatted');
    expect(result.documents[0]).toHaveProperty('showServedAt');
    expect(result.documents[0]).toHaveProperty('isStatusServed');
    expect(result.documents[0]).toHaveProperty('isPetition');
    expect(result.documents[0]).toHaveProperty('servedPartiesCode');

    expect(result.documents[1].qcWorkItemsUntouched).toEqual(false);
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

  it('should return docket entries with pending documents for pendingItemsDocketEntries', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: getDateISO(),
          document: {
            documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
            documentType: 'Administrative Record',
            pending: true,
          },
          documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          filingDate: getDateISO(),
          index: '1',
        },
        {
          createdAt: getDateISO(),
          document: {
            documentId: '6936570f-04ad-40bf-b8a2-a7ac648c30c4',
            documentType: 'Administrative Record',
          },
          documentId: '6936570f-04ad-40bf-b8a2-a7ac648c30c4',
          filingDate: getDateISO(),
          index: '1',
        },
      ],
      documents: [
        {
          documentId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          documentType: 'Administrative Record',
          pending: true,
        },
        {
          documentId: '6936570f-04ad-40bf-b8a2-a7ac648c30c4',
          documentType: 'Administrative Record',
        },
      ],
    });

    expect(result.pendingItemsDocketEntries).toMatchObject([
      {
        index: '1',
      },
    ]);
  });

  it('should return an empty array for docketRecordWithDocument and pendingItemsDocketEntries if docketRecord does not exist', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
    });

    expect(result.docketRecordWithDocument).toEqual([]);
    expect(result.pendingItemsDocketEntries).toEqual([]);
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
      docketNumberSuffix: undefined,
      hasVerifiedIrsNotice: true,
      trialTime: 11,
    });

    expect(result).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('receivedAtFormatted');
    expect(result).toHaveProperty('irsDateFormatted');
    expect(result).toHaveProperty('payGovDateFormatted');
    expect(result.docketNumberWithSuffix).toEqual('123-45');
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
    });

    expect(result).toMatchObject({
      formattedAssociatedJudge: 'Not assigned',
      formattedTrialCity: 'Boise, Idaho',
      formattedTrialDate: '11/11/11',
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

  it('should format trial details with incomplete trial information', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      status: Case.STATUS_TYPES.calendared,
      trialDate: undefined,
      trialLocation: undefined,
      trialSessionId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
    });

    expect(result).toMatchObject({
      formattedTrialCity: 'Not assigned',
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

  it('should show not scheduled section if case status is closed', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      status: Case.STATUS_TYPES.closed,
    });

    expect(result).toMatchObject({
      showNotScheduled: true,
    });
  });

  it('should set defaults for formattedTrialDate and formattedAssociatedJudge and show the prioritized section if case is high priority', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      highPriority: true,
    });

    expect(result).toMatchObject({
      formattedAssociatedJudge: 'Not assigned',
      formattedTrialDate: 'Not scheduled',
      showPrioritized: true,
    });
  });

  it('should set isLeadCase true on the case if it has a leadCaseId that matches its caseId', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      leadCaseId: mockCaseDetail.caseId,
    });

    expect(result).toMatchObject({
      isLeadCase: true,
    });
  });

  it('should set isLeadCase false on the case if it has a leadCaseId that matches its caseId', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      leadCaseId: 'notthecaseid',
    });

    expect(result).toMatchObject({
      isLeadCase: false,
    });
  });

  it('should set consolidated cases if there are any', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      consolidatedCases: [mockCaseDetail],
    });

    expect(result).toHaveProperty('consolidatedCases');
    expect(result.consolidatedCases).toMatchObject([mockCaseDetail]);
  });

  it('should not set consolidated cases if none are passed', () => {
    const result = formatCase(applicationContext, mockCaseDetail);

    expect(result).toMatchObject(mockCaseDetail);
    expect(result).not.toHaveProperty('consolidatedCases');
  });
});

describe('formatCaseDeadlines', () => {
  it('should return empty array if there are no deadlines', () => {
    const result = formatCaseDeadlines(applicationContext);
    expect(result).toMatchObject([]);
  });

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

  it('returns a value based on document properties with no objections', () => {
    const result = getFilingsAndProceedings({
      attachments: false,
      certificateOfService: false,
      exhibits: false,
      lodged: false,
      objections: 'No',
    });

    expect(result).toEqual('(No Objection)');
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
          {
            archived: false,
            createdAt: getDateISO(),
            documentId: 'd-2-3-4',
            documentType: 'Stipulated Decision',
          },
        ],
      },
      docketRecordSort: 'byDate',
    });

    expect(result.draftDocuments).toMatchObject([
      {
        editUrl: '/case-detail/123-45/edit-order/d-1-2-3',
        signUrl: '/case-detail/123-45/edit-order/d-1-2-3/sign',
        signedAtFormatted: undefined,
      },
      {
        editUrl: '/case-detail/123-45/documents/d-2-3-4/sign',
        signUrl: '/case-detail/123-45/documents/d-2-3-4/sign',
        signedAtFormatted: undefined,
      },
    ]);
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

  it('should return empty array if nothing is passed in', () => {
    // following dates selected to ensure test coverage of 'dateStringsCompared'
    const result = sortDocketRecords();

    expect(result).toEqual([]);
  });
});
