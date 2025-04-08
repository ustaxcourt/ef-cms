import {
  CASE_STATUS_TYPES,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { prepareMotionOrderResponseAction } from './prepareMotionOrderResponseAction';
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
    additionalOrderText: '',
    dueDate: '2024-04-22',
    motionOrderResponse: MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
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
  });

  it('should handle REPLY_SR selection', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          motionOrderResponse:
            MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY_SR,
          dueDate: '2024-04-22',
        },
      },
    });
    expect(result.state.form.richText).toContain(
      'shall file a Status Report',
    );
  });

  it('should handle REPLY selection', async () => {
    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          motionOrderResponse:
            MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
          dueDate: '2024-04-22',
        },
      },
    });

    expect(result.state.form.richText).not.toContain(
      'or if no Reply is filed, shall file a Status Report',
    );
    expect(result.state.form.richText).toContain('by 04/22/2024');
    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
  });

  it('should handle additional order text', async () => {
    const additionalText = 'Additional instructions for the parties.';

    const result = await runAction(prepareMotionOrderResponseAction, {
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: 'mock-motion-id',
        form: {
          ...mockForm,
          additionalOrderText: additionalText,
        },
      },
    });

    expect(result.state.form.richText).toContain(additionalText);
    expect(result.state.form.richText).toContain('It is further');
    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
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
      'session of the Court commencing on 05/01/2024 in Houston, Texas',
    );
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
      'Petitioner shall file a Response',
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
      'Respondent shall file a Response',
    );
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.documentType).toEqual('Order');
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
          consolidatedGroupOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.consolidatedGroupOrderFor.ALL_CASES,
        },
      },
    });

    expect(result.state.createOrderSelectedCases).toHaveLength(2);
    expect(result.state.createOrderSelectedCases[0].checked).toBe(true);
  });
});
