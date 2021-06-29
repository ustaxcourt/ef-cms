const {
  applicationContext,
} = require('../../../../web-client/src/applicationContext');
const {
  CASE_STATUS_TYPES,
  PAYMENT_STATUS,
} = require('../entities/EntityConstants');
const {
  formatCase,
  getFormattedCaseDetail,
} = require('./getFormattedCaseDetail');
const { createISODateString } = require('./DateHandler');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('getFormattedCaseDetail', () => {
  applicationContext.getCurrentUser = () =>
    MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'];

  const getDateISO = () =>
    applicationContext.getUtilities().createISODateString();

  describe('formatCase', () => {
    it('should set showPrintConfirmationLink to true for served cases without legacy docket entries', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            servedAt: getDateISO(),
          },
        ],
      });

      expect(result.showPrintConfirmationLink).toBeTruthy();
    });

    it('should set showPrintConfirmationLink to false for served cases with legacy docket entries', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            isLegacy: true,
            servedAt: getDateISO(),
          },
        ],
      });

      expect(result.showPrintConfirmationLink).toBeFalsy();
    });

    it('should return an empty object if caseDetail is empty', () => {
      const mockApplicationContext = {};
      const caseDetail = {};
      const result = formatCase(mockApplicationContext, caseDetail);

      expect(result).toMatchObject({});
    });

    it('should correctly format legacy served docket entries', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [{ isLegacyServed: true }],
      });

      expect(result.formattedDocketEntries[0].isNotServedDocument).toBeFalsy();
      expect(result.formattedDocketEntries[0].isUnservable).toBeTruthy();
    });

    it('should compute isNotServedDocument', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [
          {
            isLegacyServed: undefined,
            isMinuteEntry: undefined,
            servedAt: undefined,
          },
          {
            isLegacyServed: true,
            isMinuteEntry: undefined,
            servedAt: undefined,
          },
          {
            isLegacyServed: undefined,
            isMinuteEntry: true,
            servedAt: undefined,
          },
          {
            isLegacyServed: undefined,
            isMinuteEntry: undefined,
            servedAt: createISODateString(),
          },
        ],
      });

      expect(result.formattedDocketEntries[0].isNotServedDocument).toBe(true);
      expect(result.formattedDocketEntries[1].isNotServedDocument).toBe(false);
      expect(result.formattedDocketEntries[2].isNotServedDocument).toBe(false);
      expect(result.formattedDocketEntries[3].isNotServedDocument).toBe(false);
    });

    it('should format the filing date of all correspondence documents', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
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

    describe('createdAtFormatted', () => {
      it('should format docket entries and set createdAtFormatted to the formatted createdAt date if document is not a court-issued document', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: getDateISO(),
              docketEntryId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
              documentType: 'Petition',
              filingDate: getDateISO(),
              index: '1',
              isOnDocketRecord: true,
            },
          ],
        });

        expect(result).toHaveProperty('formattedDocketEntries');
        expect(
          result.formattedDocketEntries[0].createdAtFormatted,
        ).toBeDefined();
      });

      it('should format docket records and set createdAtFormatted to undefined if document is an unserved court-issued document', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...MOCK_CASE.docketEntries[0],
              documentTitle: 'Order [Judge Name] [Anything]',
              documentType: 'Order that case is assigned',
              eventCode: 'OAJ',
              filingDate: getDateISO(),
            },
          ],
        });

        expect(result).toHaveProperty('formattedDocketEntries');
        expect(
          result.formattedDocketEntries[0].createdAtFormatted,
        ).toBeUndefined();
      });

      it('should be a formatted date string using the filingDate if the document is on the docket record and is served', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: '2019-03-11T17:29:13.120Z',
              filingDate: '2019-04-19T17:29:13.120Z',
              isOnDocketRecord: true,
              servedAt: '2019-06-19T17:29:13.120Z',
            },
          ],
        });

        expect(result.formattedDocketEntries).toMatchObject([
          {
            createdAtFormatted: '04/19/19',
          },
        ]);
      });

      it('should be a formatted date string using the filingDate if the document is on the docket record and is an unserved external document', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: '2019-03-11T17:29:13.120Z',
              filingDate: '2019-04-19T17:29:13.120Z',
              isOnDocketRecord: true,
              servedAt: undefined,
            },
          ],
        });

        expect(result.formattedDocketEntries).toMatchObject([
          {
            createdAtFormatted: '04/19/19',
          },
        ]);
      });

      it('should be undefined if the document is on the docket record and is an unserved court-issued document', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: '2019-03-11T17:29:13.120Z',
              documentTitle: 'Order',
              documentType: 'Order',
              eventCode: 'O',
              filingDate: '2019-04-19T17:29:13.120Z',
              isOnDocketRecord: true,
              servedAt: undefined,
            },
          ],
        });

        expect(result.formattedDocketEntries).toMatchObject([
          {
            createdAtFormatted: undefined,
          },
        ]);
      });
    });

    it('should return docket entries with pending and served documents for pendingItemsDocketEntries', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: getDateISO(),
            docketEntryId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
            documentType: 'Administrative Record',
            filingDate: getDateISO(),
            index: '1',
            isOnDocketRecord: true,
            pending: true,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            createdAt: getDateISO(),
            docketEntryId: 'dabe913f-5310-48df-b63d-44cfccb83326',
            documentType: 'Administrative Record',
            filingDate: getDateISO(),
            index: '2',
            isOnDocketRecord: true,
            pending: true,
          },
          {
            createdAt: getDateISO(),
            docketEntryId: '6936570f-04ad-40bf-b8a2-a7ac648c30c4',
            documentType: 'Administrative Record',
            filingDate: getDateISO(),
            index: '3',
            isOnDocketRecord: true,
          },
        ],
      });

      expect(result.pendingItemsDocketEntries).toMatchObject([
        {
          index: '1',
        },
      ]);
    });

    it('should return docket entries with pending and isLegacyServed for pendingItemsDocketEntries', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            isLegacyServed: true,
            pending: true,
          },
        ],
      });

      expect(result.pendingItemsDocketEntries).toMatchObject([
        {
          index: 1,
        },
      ]);
    });

    it('should return an empty array for formattedDocketEntries and pendingItemsDocketEntries if docketRecord does not exist', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [],
      });

      expect(result.formattedDocketEntries).toEqual([]);
      expect(result.pendingItemsDocketEntries).toEqual([]);
    });

    it('should format irsPractitioners if the irsPractitioners array is set', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        irsPractitioners: [
          {
            name: 'Test Respondent',
          },
        ],
      });

      expect(result.irsPractitioners[0].formattedName).toEqual(
        'Test Respondent',
      );
    });

    it('should format privatePractitioners if the privatePractitioners array is set', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'b1234',
            name: 'Test Practitioner',
            representing: [MOCK_CASE.petitioners[0].contactId],
          },
        ],
      });

      expect(result.privatePractitioners[0].formattedName).toEqual(
        'Test Practitioner (b1234)',
      );
      expect(result.privatePractitioners[0].representingFormatted).toEqual([
        {
          name: MOCK_CASE.petitioners[0].name,
          secondaryName: MOCK_CASE.petitioners[0].secondaryName,
          title: MOCK_CASE.petitioners[0].title,
        },
      ]);
    });

    it('should format the general properties of case details', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        caseCaption: 'Johnny Joe Jacobson, Petitioner',
        hasVerifiedIrsNotice: true,
        irsNoticeDate: undefined,
        preferredTrialCity: undefined,
        trialTime: 11,
      });

      expect(result).toHaveProperty('createdAtFormatted');
      expect(result).toHaveProperty('receivedAtFormatted');
      expect(result.irsNoticeDateFormatted).toEqual('No notice provided');
      expect(result.shouldShowIrsNoticeDate).toBeTruthy();
      expect(result.caseTitle).toEqual('Johnny Joe Jacobson');
      expect(result.formattedPreferredTrialCity).toEqual(
        'No location selected',
      );
    });

    it('should append additional information to the hyperlinked descriptionDisplay when addToCoversheet is true', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        docketEntries: [
          {
            addToCoversheet: true,
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
      expect(
        result.formattedDocketEntries[0].additionalInfoDisplay,
      ).toBeUndefined();
    });

    it('should not append additional information to the hyperlinked descriptionDisplay when addToCoversheet is undefined', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
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
        'desc',
      );
      expect(result.formattedDocketEntries[0].additionalInfoDisplay).toEqual(
        'additional information',
      );
    });

    it('should format certificate of service date', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
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
        ...MOCK_CASE,
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
        ...MOCK_CASE,
        irsNoticeDate: undefined,
      });

      expect(result.irsNoticeDateFormatted).toEqual('No notice provided');
    });

    describe('should indicate blocked status', () => {
      it('should format blockedDate and when blocked is true', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
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
    });

    it('should format trial details if case status is calendared', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
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
        ...MOCK_CASE,
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

    it('should format hearing details if the case has associated hearings', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        hearings: [
          {
            judge: {
              name: 'Judge Dredd',
            },
            startDate: '2011-11-11',
            startTime: '10:00',
            trialLocation: 'Megacity One',
          },
        ],
        status: CASE_STATUS_TYPES.calendared,
        trialDate: '2011-11-11',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
      });

      expect(result).toMatchObject({
        formattedAssociatedJudge: 'Not assigned',
        formattedTrialCity: 'Boise, Idaho',
        formattedTrialDate: '11/11/11',
        hearings: [
          {
            formattedAssociatedJudge: 'Judge Dredd',
            formattedTrialCity: 'Megacity One',
            formattedTrialDate: '11/11/11 10:00 am',
            judge: {
              name: 'Judge Dredd',
            },
            startDate: '2011-11-11',
            startTime: '10:00',
            trialLocation: 'Megacity One',
          },
        ],
        showTrialCalendared: true,
      });
      expect(result).not.toHaveProperty('showBlockedFromTrial');
      expect(result).not.toHaveProperty('showNotScheduled');
      expect(result).not.toHaveProperty('showScheduled');
    });

    it('should format trial details with incomplete trial information', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
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
      const result = formatCase(applicationContext, MOCK_CASE);

      expect(result).toMatchObject({
        showNotScheduled: true,
      });
    });

    it('should return showNotScheduled as true when the case has not been added to a trial session', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.closed,
      });

      expect(result.showNotScheduled).toBeTruthy();
    });

    it('should return showNotScheduled as false when the case status is closed and has been added to a trial session', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.closed,
        trialSessionId: '4f8bd637-fc3b-4073-85b4-388f22731854',
      });

      expect(result.showNotScheduled).toBeFalsy();
    });

    it('should return showScheduled as true when case status is closed and has been added to a trial session', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.closed,
        trialSessionId: '4f8bd637-fc3b-4073-85b4-388f22731854',
      });

      expect(result.showScheduled).toBeTruthy();
    });

    it('should set defaults for formattedTrialDate and formattedAssociatedJudge and show the prioritized section if case is high priority', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
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
        ...MOCK_CASE,
        leadDocketNumber: MOCK_CASE.docketNumber,
      });

      expect(result).toMatchObject({
        isLeadCase: true,
      });
    });

    it('should set isLeadCase false on the case if it has a leadDocketNumber that matches its docketNumber', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        leadDocketNumber: 'notthedocketNumber',
      });

      expect(result).toMatchObject({
        isLeadCase: false,
      });
    });

    it('should set consolidated cases if there are any', () => {
      const result = formatCase(applicationContext, {
        ...MOCK_CASE,
        consolidatedCases: [MOCK_CASE],
      });

      expect(result).toHaveProperty('consolidatedCases');
      expect(result.consolidatedCases).toMatchObject([MOCK_CASE]);
    });

    it('should not set consolidated cases if none are passed', () => {
      const result = formatCase(applicationContext, MOCK_CASE);

      expect(result).toMatchObject(MOCK_CASE);
      expect(result).not.toHaveProperty('consolidatedCases');
    });

    describe('qcNeeded', () => {
      it('should be true for a docket entry that is not in-progress and has an incomplete work item', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              isFileAttached: true,
              isLegacySealed: true,
              isOnDocketRecord: true,
              servedAt: getDateISO(),
              workItem: {
                completedAt: undefined,
                isRead: false,
              },
            },
          ],
        });
        expect(result.formattedDocketEntries[0].qcNeeded).toBeTruthy();
      });

      it('should be false for a docket entry that is in-progress and has an incomplete work item', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              isFileAttached: false,
              isLegacySealed: true,
              isOnDocketRecord: true,
              servedAt: getDateISO(),
              workItem: {
                completedAt: undefined,
                isRead: false,
              },
            },
          ],
        });

        expect(result.formattedDocketEntries[0].qcNeeded).toBeFalsy();
      });

      it('should be false for a docket entry that is not in-progress and does not have an incomplete work item', () => {
        const result = formatCase(applicationContext, {
          ...MOCK_CASE,
          docketEntries: [
            {
              isFileAttached: true,
              isLegacySealed: true,
              isOnDocketRecord: true,
              servedAt: getDateISO(),
            },
          ],
        });

        expect(result.formattedDocketEntries[0].qcNeeded).toBeFalsy();
      });
    });
  });

  describe('getFormattedCaseDetail', () => {
    it('should call formatCase and add additional details on the given case', () => {
      const result = getFormattedCaseDetail({
        applicationContext,
        caseDetail: { ...MOCK_CASE },
        docketRecordSort: 'byDate',
      });

      expect(result).toHaveProperty('createdAtFormatted');
      expect(result).toHaveProperty('formattedDocketEntries');
      expect(result).toHaveProperty('docketRecordSort');
    });

    it('should format draft documents', () => {
      const result = getFormattedCaseDetail({
        applicationContext,
        caseDetail: {
          ...MOCK_CASE,
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
          editUrl: `/case-detail/${MOCK_CASE.docketNumber}/edit-order/d-1-2-3`,
          signUrl: `/case-detail/${MOCK_CASE.docketNumber}/edit-order/d-1-2-3/sign`,
          signedAtFormatted: undefined,
        },
        {
          editUrl: `/case-detail/${MOCK_CASE.docketNumber}/edit-order/d-2-3-4`,
          signUrl: `/case-detail/${MOCK_CASE.docketNumber}/edit-order/d-2-3-4/sign`,
          signedAtFormatted: undefined,
        },
        {
          editUrl: `/case-detail/${MOCK_CASE.docketNumber}/edit-upload-court-issued/d-3-4-5`,
          signUrl: `/case-detail/${MOCK_CASE.docketNumber}/edit-order/d-3-4-5/sign`,
          signedAtFormatted: undefined,
        },
      ]);
    });

    it('should sort draft documents by their receivedAt', () => {
      const result = getFormattedCaseDetail({
        applicationContext,
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'd-1-2-3',
              documentType: 'Order',
              isDraft: true,
              receivedAt: '2019-08-03T06:26:44.000Z',
            },
            {
              docketEntryId: 'd-2-3-4',
              documentType: 'Stipulated Decision',
              isDraft: true,
              receivedAt: '2019-08-03T06:10:44.000Z',
            },
            {
              docketEntryId: 'd-3-4-5',
              documentType: 'Miscellaneous',
              isDraft: true,
              receivedAt: '2018-07-03T06:26:44.000Z',
            },
          ],
        },
      });

      expect(result.draftDocuments).toMatchObject([
        { receivedAt: '2018-07-03T06:26:44.000Z' },
        { receivedAt: '2019-08-03T06:10:44.000Z' },
        { receivedAt: '2019-08-03T06:26:44.000Z' },
      ]);
    });
  });

  it('should format filing fee string for a paid petition fee', () => {
    const result = getFormattedCaseDetail({
      applicationContext,
      caseDetail: {
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
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-03-01T21:40:46.415Z',
      },
    });

    expect(result.filingFee).toEqual('Waived 03/01/19 ');
  });

  it('should format filing fee string for an unpaid petition fee', () => {
    const result = getFormattedCaseDetail({
      applicationContext,
      caseDetail: { petitionPaymentStatus: PAYMENT_STATUS.UNPAID },
    });

    expect(result.filingFee).toEqual(`${PAYMENT_STATUS.UNPAID}  `);
  });
});
