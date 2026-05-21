import {
  CASE_STATUS_TYPES,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { prepareMotionOrderResponseAction } from './prepareMotionOrderResponseAction';
import { setFormValueAction } from '../setFormValueAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareMotionOrderResponseAction', () => {
  const mockDocketEntry = {
    docketEntryId: 'mock-motion-id',
    documentTitle: 'Motion to Dismiss',
    filedBy: 'Petr. Test Petitioner',
    filingDate: '2024-03-22',
    index: 1,
  };

  const mockCaseDetail = {
    docketNumber: '123-45',
    leadDocketNumber: '123-45',
    petitioners: [{ name: 'Test Petitioner' }],
    status: CASE_STATUS_TYPES.new,
    docketEntries: [mockDocketEntry],
  };

  const mockForm = {
    additionalOrderTextArray: [''],
    dueDate: '2024-04-22',
    motionOrderResponse: true,
    responseDate: '2024-03-29',
    strickenFromTrialSession: false,
  };

  it('should handle missing order reply selection', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          dueDate: undefined,
          motionOrderResponse: undefined,
        },
      },
    });

    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.richText).not.toContain('shall file a Reply');
    expect(result.state.form.richText).toContain('shall file a Response');
    expect(result.state.form.additionalOrderTextArray).toEqual(['']);
  });

  it('should handle REPLY selection', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          motionOrderResponse: true,
          dueDate: '2024-04-22',
        },
      },
    });

    expect(result.state.form.richText).not.toContain(
      'or if no Reply is filed, shall file a Status Report',
    );
    expect(result.state.form.richText).toContain('by April 22, 2024');
    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.additionalOrderTextArray).toEqual(['']);
  });

  it('should handle additional order text', async () => {
    const additionalText = 'Additional instructions for the parties.';

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          additionalOrderTextArray: [additionalText],
        },
      },
    });

    expect(result.state.form.richText).toContain(additionalText);
    expect(result.state.form.richText).toContain('It is further');
    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.additionalOrderTextArray).toEqual([additionalText]);
  });

  it('should handle calendared case with trial session', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          status: CASE_STATUS_TYPES.calendared,
          trialDate: '2024-05-01',
          trialLocation: 'Houston, Texas',
        },
        docketEntryId: 'mock-motion-id',
        form: mockForm,
      },
    });

    expect(result.state.form.richText).toContain(
      'session of the Court commencing on May 1, 2024, in Houston, Texas',
    );
  });

  it('normalizes additionalOrderTextArray by removing whitespace-only entries and updates form state', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          additionalOrderTextArray: ['', ' \t\n ', 'Keep this.'],
        },
      },
    });

    expect(result.state.form.additionalOrderTextArray).toEqual(['Keep this.']);
    expect(result.state.form.richText).toContain('ORDERED that Keep this.');
  });

  it('normalizes optional whitespace-only row after indexed form updates', async () => {
    const baseState = {
      caseDetail: mockCaseDetail,
      docketEntryId: 'mock-motion-id',
      form: { ...mockForm },
    };

    const withSecondRow = await runAction(setFormValueAction, {
      props: {
        allowEmptyString: true,
        key: 'additionalOrderTextArray',
        value: ['', ''],
      },
      state: baseState,
    });

    const withWhitespaceInOptionalRow = await runAction(setFormValueAction, {
      props: {
        allowEmptyString: true,
        index: 1,
        key: 'additionalOrderTextArray',
        value: '  \t  ',
      },
      state: withSecondRow.state,
    });

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: withWhitespaceInOptionalRow.state,
    });

    expect(result.state.form.additionalOrderTextArray).toEqual(['']);
    expect(result.state.form.additionalOrderTextArray.length).toBe(1);
    expect(result.state.form.additionalOrderTextArray[1]).toBeUndefined();
  });

  it('should handle stricken from trial sessions', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          strickenFromTrialSession: true,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      'ORDERED that this case is stricken from the trial session',
    );
  });

  it('should handle respondent as movant', async () => {
    const respondentDocketEntry = {
      ...mockDocketEntry,
      filedBy: 'Respt. Test Respondent',
    };

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          docketEntries: [respondentDocketEntry],
        },
        docketEntryId: 'mock-motion-id',
        form: mockForm,
      },
    });

    expect(result.state.form.richText).toContain(
      'petitioner shall file a Response',
    );
  });

  it('should handle petitioner as movant', async () => {
    const petitionerDocketEntry = {
      ...mockDocketEntry,
      filedBy: 'Petr. Test Petitioner',
    };

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          docketEntries: [petitionerDocketEntry],
        },
        docketEntryId: 'mock-motion-id',
        form: mockForm,
      },
    });

    expect(result.state.form.richText).toContain(
      'respondent shall file a Response',
    );
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.documentType).toEqual('Order');
  });

  it('should handle having multiple petitioners as movant', async () => {
    const petitionerDocketEntry = {
      ...mockDocketEntry,
      filedBy: 'Petr. Test Petitioner',
    };

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          petitioners: [
            { name: 'Test Petitioner' },
            { name: 'Test Petitioner 2' },
          ],
          docketEntries: [petitionerDocketEntry],
        },
        docketEntryId: 'mock-motion-id',
        form: mockForm,
      },
    });

    expect(result.state.form.richText).toContain('petitioners filed a Motion');
  });

  it('should handle having multiple petitioners as nonmovant', async () => {
    const respondentDocketEntry = {
      ...mockDocketEntry,
      filedBy: 'Respt. Test Respondent',
    };

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          petitioners: [
            { name: 'Test Petitioner' },
            { name: 'Test Petitioner 2' },
          ],
          docketEntries: [respondentDocketEntry],
        },
        docketEntryId: 'mock-motion-id',
        form: mockForm,
      },
    });

    expect(result.state.form.richText).toContain(
      'petitioners shall file a Response',
    );
  });

  it('should handle consolidated cases', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          consolidatedCases: [
            { docketNumber: '123-45', docketNumberWithSuffix: '123-45S' },
            { docketNumber: '123-46', docketNumberWithSuffix: '123-46S' },
          ],
        },
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          issueOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
        },
      },
    });

    expect(result.state.createOrderSelectedCases).toHaveLength(2);
    expect(result.state.createOrderSelectedCases[0].checked).toBe(true);
  });

  it('should set initialFreeText based on movant and responseDate', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: mockForm,
      },
    });

    expect(result.state.form.initialFreeText).toContain(
      'respondent shall file a Response',
    );
  });

  it('should correctly format the text for a basic order', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: mockForm,
        parentMessageId: 'parent-456',
      },
    });

    const expectedHtml = `<p class="indent-paragraph"> On March 22, 2024, petitioner filed a Motion to Dismiss (doc. no. 1). For cause, it is </p><p class="indent-paragraph">ORDERED that by March 29, 2024, respondent shall file a Response to the Motion to Dismiss. It is further</p><p class="indent-paragraph">ORDERED that by April 22, 2024, petitioner may file a Reply.</p>`;
    expect(result.state.form.richText).toEqual(expectedHtml);
  });

  it('should correctly format the text for a consolidated case when order is issued for all cases in the group', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          consolidatedCases: [
            { docketNumber: '123-45', docketNumberWithSuffix: '123-45S' },
            { docketNumber: '123-46', docketNumberWithSuffix: '123-46S' },
          ],
        },
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          issueOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
        },
      },
    });

    const expectedHtml = `<p class="indent-paragraph"> On March 22, 2024, petitioner filed a Motion to Dismiss (lead case doc. no. 1). For cause, it is </p><p class="indent-paragraph">ORDERED that by March 29, 2024, respondent shall file a Response to the Motion to Dismiss. It is further</p><p class="indent-paragraph">ORDERED that by April 22, 2024, petitioner may file a Reply.</p>`;
    expect(result.state.form.richText).toEqual(expectedHtml);
  });

  it('should correctly format the text for a consolidated case when order is issued for just the lead case', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          consolidatedCases: [
            { docketNumber: '123-45', docketNumberWithSuffix: '123-45S' },
            { docketNumber: '123-46', docketNumberWithSuffix: '123-46S' },
          ],
        },
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          issueOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY,
        },
      },
    });

    const expectedHtml = `<p class="indent-paragraph"> On March 22, 2024, petitioner filed a Motion to Dismiss (doc. no. 1). For cause, it is </p><p class="indent-paragraph">ORDERED that by March 29, 2024, respondent shall file a Response to the Motion to Dismiss. It is further</p><p class="indent-paragraph">ORDERED that by April 22, 2024, petitioner may file a Reply.</p>`;
    expect(result.state.form.richText).toEqual(expectedHtml);
  });

  it('should correctly format order text with a preamble, response, reply, stricken line, and additional text', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          status: CASE_STATUS_TYPES.calendared,
          trialDate: '2024-06-03',
          trialLocation: 'New York, NY',
        },
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          additionalOrderTextArray: ['The Court expects full compliance.'],
          strickenFromTrialSession: true,
        },
      },
    });

    const { richText } = result.state.form;

    expect(richText).toContain(
      'session of the Court commencing on June 3, 2024, in New York, NY',
    );
    expect(richText).toContain('respondent shall file a Response');
    expect(richText).toContain('petitioner may file a Reply');
    expect(richText).toContain(
      'ORDERED that this case is stricken from the trial session',
    );
    expect(richText).toContain(
      'ORDERED that The Court expects full compliance.',
    );
    expect(richText).not.toContain('compliance..');
  });

  it('should chain multiple additional order text clauses with It is further', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          additionalOrderTextArray: ['First clause', 'Second clause'],
        },
      },
    });

    expect(result.state.form.richText).toContain(
      '<p class="indent-paragraph">ORDERED that First clause. It is further</p><p class="indent-paragraph">ORDERED that Second clause.</p>',
    );
  });

  it('should not display Invalid DateTime when given an invalid date string in pdf preview', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
        },
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          responseDate: 'randomstring',
          dueDate: 'randomstring',
        },
      },
    });

    expect(result.state.form.richText).not.toContain(
      'ORDERED that by Invalid DateTime, respondent shall file a Response',
    );
    expect(result.state.form.richText).not.toContain(
      'ORDERED that by Invalid DateTime, petitioner may file a Reply',
    );
  });
});
