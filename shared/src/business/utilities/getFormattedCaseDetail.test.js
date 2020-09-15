const {
  applicationContext,
} = require('../../../../web-client/src/applicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  OBJECTIONS_OPTIONS_MAP,
  PAYMENT_STATUS,
  ROLES,
  SERVED_PARTIES_CODES,
  TRANSCRIPT_EVENT_CODE,
} = require('../entities/EntityConstants');
const {
  documentMeetsAgeRequirements,
  formatCase,
  formatCaseDeadlines,
  formatDocketEntry,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketEntries,
  TRANSCRIPT_AGE_DAYS_MIN,
} = require('./getFormattedCaseDetail');
const { calculateISODate, createISODateString } = require('./DateHandler');
const { MOCK_USERS } = require('../../test/mockUsers');

applicationContext.getCurrentUser = () =>
  MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'];

const mockCaseDetailBase = {
  correspondence: [],
  createdAt: new Date(),
  docketEntries: [],
  docketNumber: '123-45',
  docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
  docketNumberWithSuffix: '123-45S',
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
    const documents = [
      {
        createdAt: getDateISO(),
        docketEntryId: 'd-1-2-3',
        documentType: 'Petition',
        eventCode: 'P',
        index: 1,
        isLegacySealed: true,
        isOnDocketRecord: true,
        servedAt: getDateISO(),
        workItem: {
          completedAt: getDateISO(),
        },
      },
      {
        createdAt: getDateISO(),
        docketEntryId: 'd-1-4-3',
        documentType: 'Amended Answer',
        eventCode: 'ABC',
        index: 2,
        isOnDocketRecord: true,
        servedAt: getDateISO(),
        workItem: {
          completedAt: getDateISO(),
        },
      },
    ];

    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: documents,
      documents,
    });
    expect(result.formattedDocketEntries[0].isPetition).toBeTruthy();
    expect(result.formattedDocketEntries[0].qcWorkItemsCompleted).toBeTruthy();
    expect(result.formattedDocketEntries[0].qcWorkItemsUntouched).toEqual(
      false,
    );

    expect(result.formattedDocketEntries[0]).toHaveProperty(
      'createdAtFormatted',
    );
    expect(result.formattedDocketEntries[0]).toHaveProperty(
      'servedAtFormatted',
    );
    expect(result.formattedDocketEntries[0]).toHaveProperty('showServedAt');
    expect(result.formattedDocketEntries[0]).toHaveProperty('isStatusServed');
    expect(result.formattedDocketEntries[0]).toHaveProperty('isPetition');
    expect(result.formattedDocketEntries[0]).toHaveProperty(
      'servedPartiesCode',
    );
    expect(result.formattedDocketEntries[0].showLegacySealed).toBeTruthy();

    expect(result.formattedDocketEntries[1].showLegacySealed).toBeFalsy();
    expect(result.formattedDocketEntries[1].qcWorkItemsUntouched).toEqual(
      false,
    );
  });

  it('should correctly format legacy served docket entries', () => {
    const docketEntries = [
      {
        createdAt: getDateISO(),
        docketEntryId: 'd-1-2-3',
        documentType: 'Petition',
        eventCode: 'P',
        index: 1,
        isLegacyServed: true,
        isOnDocketRecord: true,
      },
      {
        createdAt: getDateISO(),
        docketEntryId: 'd-1-4-3',
        documentType: 'Amended Answer',
        eventCode: 'ABC',
        index: 2,
        isLegacyServed: true,
        isOnDocketRecord: true,
      },
    ];

    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries,
    });

    expect(result.formattedDocketEntries[0].isNotServedDocument).toBeFalsy();
    expect(result.formattedDocketEntries[0].isUnservable).toBeTruthy();

    expect(result.formattedDocketEntries[1].isNotServedDocument).toBeFalsy();
    expect(result.formattedDocketEntries[1].isUnservable).toBeTruthy();
  });

  it('should format the filing date of all correspondence documents', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      correspondence: [
        {
          documentTitle: 'Test Correspondence',
          filedBy: 'Test Docket Clerk',
          filingDate: '2020-05-21T18:21:59.818Z',
        },
      ],
    });

    expect(result.correspondence[0].formattedFilingDate).toEqual('05/21/20');
  });

  it('should format docket entries from documents', () => {
    const documents = [
      {
        createdAt: getDateISO(),
        docketEntryId: '123',
        index: '1',
        isOnDocketRecord: true,
      },
    ];

    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: documents,
      documents,
    });

    expect(result.formattedDocketEntries[0]).toHaveProperty(
      'createdAtFormatted',
    );
    expect(result).toHaveProperty('formattedDocketEntries');
  });

  it('should format docket entries and set createdAtFormatted to the formatted createdAt date if document is not a court-issued document', () => {
    const documents = [
      {
        createdAt: getDateISO(),
        docketEntryId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
        documentType: 'Petition',
        filingDate: getDateISO(),
        index: '1',
        isOnDocketRecord: true,
      },
    ];

    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: documents,
      documents,
    });

    expect(result).toHaveProperty('formattedDocketEntries');
    expect(result.formattedDocketEntries[0].createdAtFormatted).toBeDefined();
  });

  it('should format docket records and set createdAtFormatted to undefined if document is an unserved court-issued document', () => {
    const documents = [
      {
        createdAt: getDateISO(),
        docketEntryId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
        documentTitle: 'Order [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        eventCode: 'OAJ',
        filingDate: getDateISO(),
        index: 1,
        isOnDocketRecord: true,
        scenario: 'Type B',
      },
    ];

    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: documents,
      documents,
    });

    expect(result).toHaveProperty('formattedDocketEntries');
    expect(result.formattedDocketEntries[0].createdAtFormatted).toBeUndefined();
  });

  it('should return docket entries with pending documents for pendingItemsDocketEntries', () => {
    const documents = [
      {
        createdAt: getDateISO(),
        docketEntryId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
        documentType: 'Administrative Record',
        filingDate: getDateISO(),
        index: '1',
        isOnDocketRecord: true,
        pending: true,
      },
      {
        createdAt: getDateISO(),
        docketEntryId: '6936570f-04ad-40bf-b8a2-a7ac648c30c4',
        documentType: 'Administrative Record',
        filingDate: getDateISO(),
        index: '2',
        isOnDocketRecord: true,
      },
    ];

    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: documents,
      documents,
    });

    expect(result.pendingItemsDocketEntries).toMatchObject([
      {
        index: '1',
      },
    ]);
  });

  it('should return an empty array for formattedDocketEntries and pendingItemsDocketEntries if docketRecord does not exist', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
    });

    expect(result.formattedDocketEntries).toEqual([]);
    expect(result.pendingItemsDocketEntries).toEqual([]);
  });

  it('should format irsPractitioners if the irsPractitioners array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      irsPractitioners: [
        {
          name: 'Test Respondent',
        },
      ],
    });

    expect(result.irsPractitioners[0].formattedName).toEqual('Test Respondent');
  });

  it('should format privatePractitioners if the privatePractitioners array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      privatePractitioners: [
        {
          barNumber: 'b1234',
          name: 'Test Practitioner',
        },
      ],
    });

    expect(result.privatePractitioners[0].formattedName).toEqual(
      'Test Practitioner (b1234)',
    );
  });

  it('should format the general properties of case details', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      caseCaption: 'Johnny Joe Jacobson, Petitioner',
      hasVerifiedIrsNotice: true,
      trialTime: 11,
    });

    expect(result).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('receivedAtFormatted');
    expect(result.irsNoticeDateFormatted).toEqual('No notice provided');
    expect(result.shouldShowIrsNoticeDate).toBeTruthy();
    expect(result.caseTitle).toEqual('Johnny Joe Jacobson');
    expect(result.formattedPreferredTrialCity).toEqual('No location selected');
  });

  it('should apply additional information', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: [
        {
          additionalInfo: 'additional information',
          createdAt: getDateISO(),
          docketEntryId: 'd-1-2-3',
          documentTitle: 'desc',
          documentType: 'Petition',
          index: '1',
          isOnDocketRecord: true,
          servedAt: getDateISO(),
        },
      ],
    });

    expect(result.formattedDocketEntries[0].descriptionDisplay).toEqual(
      'desc additional information',
    );
  });

  it('should format certificate of service date', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketEntries: [
        {
          certificateOfServiceDate: getDateISO(),
          createdAt: getDateISO(),
          docketEntryId: 'd-1-2-3',
          documentType: 'Petition',
          index: '1',
          servedAt: getDateISO(),
        },
      ],
    });

    expect(
      result.formattedDocketEntries[0].certificateOfServiceDateFormatted,
    ).toEqual(
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

  describe('should indicate blocked status', () => {
    it('should format blockedDate and automaticBlockedDate when blocked and automaticBlocked are true', () => {
      const result = formatCase(applicationContext, {
        ...mockCaseDetail,
        automaticBlocked: true,
        automaticBlockedDate: '2020-01-06T11:12:13.007Z',
        automaticBlockedReason: 'for reasons',
        blocked: true,
        blockedDate: getDateISO(),
        blockedReason: 'for reasons',
      });

      expect(result).toMatchObject({
        automaticBlockedDateFormatted: applicationContext
          .getUtilities()
          .formatDateString('2020-01-06T11:12:13.007Z', 'MMDDYY'),
        blockedDateFormatted: applicationContext
          .getUtilities()
          .formatDateString(getDateISO(), 'MMDDYY'),
        showBlockedFromTrial: true,
      });
    });
    it('should format blockedDate and when blocked is true', () => {
      const result = formatCase(applicationContext, {
        ...mockCaseDetail,
        blocked: true,
        blockedDate: getDateISO(),
        blockedReason: 'for reasons',
      });

      expect(result).toMatchObject({
        blockedDateFormatted: applicationContext
          .getUtilities()
          .formatDateString(getDateISO(), 'MMDDYY'),
        showBlockedFromTrial: true,
      });
    });

    it('should show automatic blocked and high priority indicator if the case is automaticBlocked and highPriority', () => {
      const result = formatCase(applicationContext, {
        ...mockCaseDetail,
        automaticBlocked: true,
        automaticBlockedDate: '2020-01-06T11:12:13.007Z',
        automaticBlockedReason: 'for reasons',
        highPriority: true,
      });

      expect(result.showAutomaticBlockedAndHighPriority).toBeTruthy();
    });

    it('should not show automatic blocked and high priority indicator if the case is automaticBlocked but not highPriority', () => {
      const result = formatCase(applicationContext, {
        ...mockCaseDetail,
        automaticBlocked: true,
        automaticBlockedDate: '2020-01-06T11:12:13.007Z',
        automaticBlockedReason: 'for reasons',
        highPriority: false,
      });

      expect(result.showAutomaticBlockedAndHighPriority).toBeFalsy();
    });
  });

  it('should format trial details if case status is calendared', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      status: CASE_STATUS_TYPES.calendared,
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
      status: CASE_STATUS_TYPES.calendared,
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
      status: CASE_STATUS_TYPES.closed,
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

  it('should set isLeadCase true on the case if it has a leadDocketNumber that matches its docketNumber', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      leadDocketNumber: mockCaseDetail.docketNumber,
    });

    expect(result).toMatchObject({
      isLeadCase: true,
    });
  });

  it('should set isLeadCase false on the case if it has a leadDocketNumber that matches its docketNumber', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      leadDocketNumber: 'notthedocketNumber',
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

describe('formatDocketEntry', () => {
  it('should format the servedAt date', () => {
    const results = formatDocketEntry(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
    });
    expect(results).toMatchObject({
      servedAtFormatted: '03/27/19',
    });
  });

  it('should format only lodged documents with overridden eventCode MISCL', () => {
    const result = formatDocketEntry(
      applicationContext,

      {
        docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
        documentType: 'Motion for Leave to File Administrative Record',
        eventCode: 'M115',
        lodged: true,
      },
    );

    expect(result.eventCode).toEqual('MISCL');
  });

  it('should set the servedPartiesCode to `B` if servedAt date exists and servedParties is an array', () => {
    const results = formatDocketEntry(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
      servedParties: ['someone', 'someone else'],
    });
    expect(results).toMatchObject({
      servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
    });
  });

  it('should set the servedPartiesCode to `R` if servedAt date exists and servedParties is an array of length 1 with role irsSuperuser', () => {
    const results = formatDocketEntry(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
      servedParties: [{ role: ROLES.irsSuperuser }],
    });
    expect(results).toMatchObject({
      servedPartiesCode: SERVED_PARTIES_CODES.RESPONDENT,
    });
  });

  describe('isInProgress', () => {
    it('should return isInProgress true if the document is not court-issued, not a minute entry, does not have a file attached, and is not unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'A', //not unservable, not court-issued
        isFileAttached: false,
        isMinuteEntry: false,
      });
      expect(results.isInProgress).toEqual(true);
    });

    it('should return isInProgress true if the document has a file attached and is not served or unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'A', //not unservable
        isFileAttached: true,
      });
      expect(results.isInProgress).toEqual(true);
    });

    it('should return isInProgress false if the document is court-issued', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'O', //court-issued
      });
      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document has a file attached and is served', () => {
      const results = formatDocketEntry(applicationContext, {
        isFileAttached: true,
        servedAt: '2019-03-01T21:40:46.415Z',
      });
      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document has a file attached and is unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'CTRA', //unservable
        isFileAttached: true,
      });
      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document is a minute entry', () => {
      const results = formatDocketEntry(applicationContext, {
        isMinuteEntry: true,
      });
      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document is unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'CTRA', //unservable
      });
      expect(results.isInProgress).toEqual(false);
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
      objections: OBJECTIONS_OPTIONS_MAP.YES,
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
      objections: OBJECTIONS_OPTIONS_MAP.NO,
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
    expect(result).toHaveProperty('formattedDocketEntries');
    expect(result).toHaveProperty('docketRecordSort');
    expect(result).toHaveProperty('caseDeadlines');
  });

  it('should format draft documents', () => {
    const result = getFormattedCaseDetail({
      applicationContext,
      caseDetail: {
        ...mockCaseDetailBase,
        docketEntries: [
          {
            archived: false,
            createdAt: getDateISO(),
            docketEntryId: 'd-1-2-3',
            documentType: 'Order',
            isDraft: true,
          },
          {
            archived: false,
            createdAt: getDateISO(),
            docketEntryId: 'd-2-3-4',
            documentType: 'Stipulated Decision',
            isDraft: true,
          },
          {
            archived: false,
            createdAt: getDateISO(),
            docketEntryId: 'd-3-4-5',
            documentType: 'Miscellaneous',
            isDraft: true,
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
        editUrl: '/case-detail/123-45/edit-order/d-2-3-4',
        signUrl: '/case-detail/123-45/edit-order/d-2-3-4/sign',
        signedAtFormatted: undefined,
      },
      {
        editUrl: '/case-detail/123-45/edit-upload-court-issued/d-3-4-5',
        signUrl: '/case-detail/123-45/edit-order/d-3-4-5/sign',
        signedAtFormatted: undefined,
      },
    ]);
  });
});

describe('documentMeetsAgeRequirements', () => {
  it('indicates success if document is not a transcript', () => {
    const nonTranscriptEventCode = 'BANANA'; // this is not a transcript event code - to think otherwise would just be bananas.
    const result = documentMeetsAgeRequirements({
      eventCode: nonTranscriptEventCode,
    });
    expect(result).toBeTruthy();
  });
  it(`indicates success if document is a transcript aged more than ${TRANSCRIPT_AGE_DAYS_MIN} days`, () => {
    const result = documentMeetsAgeRequirements({
      eventCode: TRANSCRIPT_EVENT_CODE,
      secondaryDate: '2010-01-01T01:02:03.007Z', // 10yr old transcript
    });
    expect(result).toBeTruthy();
  });
  it(`indicates failure if document is a transcript aged less than ${TRANSCRIPT_AGE_DAYS_MIN} days`, () => {
    const aShortTimeAgo = calculateISODate({
      dateString: createISODateString(),
      howMuch: -12,
      units: 'hours',
    });
    const result = documentMeetsAgeRequirements({
      eventCode: TRANSCRIPT_EVENT_CODE,
      secondaryDate: aShortTimeAgo,
    });
    expect(result).toBeFalsy();
  });
});

it('should format filing fee string for a paid petition fee', () => {
  const result = getFormattedCaseDetail({
    applicationContext,
    caseDetail: {
      ...mockCaseDetailBase,
      petitionPaymentDate: '2019-03-01T21:40:46.415Z',
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    },
  });

  expect(result.filingFee).toEqual('Paid 03/01/19 check');
});

it('should format filing fee string for a waived petition fee', () => {
  const result = getFormattedCaseDetail({
    applicationContext,
    caseDetail: {
      ...mockCaseDetailBase,
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2019-03-01T21:40:46.415Z',
    },
  });

  expect(result.filingFee).toEqual('Waived 03/01/19 ');
});

it('should format filing fee string for an unpaid petition fee', () => {
  const result = getFormattedCaseDetail({
    applicationContext,
    caseDetail: {
      ...mockCaseDetailBase,
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    },
  });

  expect(result.filingFee).toEqual('Not Paid  ');
});

describe('sortDocketEntries', () => {
  it('should sort docket records by date by default', () => {
    // following dates selected to ensure test coverage of 'dateStringsCompared'
    const result = sortDocketEntries(
      [
        {
          filingDate: '2019-07-08',
          index: 2,
        },
        {
          filingDate: '2019-08-03T00:06:44.000Z',
          index: 1,
        },
        {
          filingDate: '2019-07-08T00:01:19.000Z',
          index: 4,
        },
        {
          filingDate: '2017-01-01T00:01:02.025Z',
          index: 3,
        },
        {
          filingDate: '2017-01-01T00:01:12.025Z',
          index: 5,
        },
      ],
      'Desc',
    );

    expect(result[0].index).toEqual(1);
  });

  it('should sort items by index when item calendar dates match', () => {
    const result = sortDocketEntries(
      [
        {
          filingDate: '2019-08-03T00:10:02.000Z', // 8/2 @ 8:10:02PM EST
          index: 2,
        },
        {
          filingDate: '2019-08-03T00:10:00.000Z', // 8/2 @ 8:10:00PM EST
          index: 1,
        },
        {
          filingDate: '2019-08-03T02:06:10.000Z', // 8/2 @ 10:10:00PM EST
          index: 4,
        },
        {
          filingDate: '2019-08-03T06:06:44.000Z', // 8/3 @ 2:10:02AM EST
          index: 3,
        },
        {
          filingDate: '2019-09-01T00:01:12.025Z', // 8/31 @ 8:01:12AM EST
          index: 5,
        },
      ],
      'byDate',
    );

    expect(result[0].index).toEqual(1);
    expect(result).toMatchObject([
      {
        index: 1,
      },
      {
        index: 2,
      },
      {
        index: 4,
      },
      {
        index: 3,
      },
      {
        index: 5,
      },
    ]);
  });

  it('should sort docket records by index when sortBy is byIndex', () => {
    const result = sortDocketEntries(
      [
        {
          filingDate: getDateISO(),
          index: 2,
        },
        {
          filingDate: getDateISO(),
          index: 3,
        },
        {
          filingDate: getDateISO(),
          index: 1,
        },
      ],
      'byIndex',
    );

    expect(result[1].index).toEqual(2);
  });

  it('should sort docket records in reverse if Desc is included in sortBy', () => {
    const result = sortDocketEntries(
      [
        {
          filingDate: getDateISO(),
          index: 2,
        },
        {
          filingDate: getDateISO(),
          index: 3,
        },
        {
          filingDate: getDateISO(),
          index: 1,
        },
      ],
      'byIndexDesc',
    );

    expect(result[0].index).toEqual(3);
  });

  it('should return empty array if nothing is passed in', () => {
    // following dates selected to ensure test coverage of 'dateStringsCompared'
    const result = sortDocketEntries();

    expect(result).toEqual([]);
  });

  it('should sort items that do not display a filingDate (based on createdAtFormatted) at the bottom', () => {
    const result = sortDocketEntries(
      [
        {
          createdAtFormatted: '2019-08-04T00:10:02.000Z',
          index: 2,
        },
        {
          createdAtFormatted: undefined,
        },
        {
          createdAtFormatted: '2019-08-03T00:10:02.000Z',
          index: 1,
        },
        {
          createdAtFormatted: undefined,
        },
      ],
      'byIndexDesc',
    );

    expect(result).toEqual([
      {
        createdAtFormatted: '2019-08-04T00:10:02.000Z',
        index: 2,
      },
      {
        createdAtFormatted: '2019-08-03T00:10:02.000Z',
        index: 1,
      },
      {
        createdAtFormatted: undefined,
      },
      {
        createdAtFormatted: undefined,
      },
    ]);
  });
});
