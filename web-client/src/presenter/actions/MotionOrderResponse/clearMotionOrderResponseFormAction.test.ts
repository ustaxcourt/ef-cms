import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { clearMotionOrderResponseFormAction } from './clearMotionOrderResponseFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearMotionOrderResponseFormAction', () => {
  it('should clear all motion order response form fields', async () => {
    const mockStore = {
      form: {
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
        motionOrderResponse: 'Reply',
        additionalOrderText: 'Some text',
        dueDate: '2024-03-22',
        responseDate: '2024-03-21',
        strickenFromTrialSession: true,
      },
    };

    const result = await runAction(clearMotionOrderResponseFormAction, {
      state: mockStore,
    });

    expect(result.state.form).toEqual({});
  });

  it('should handle clearing empty form fields', async () => {
    const result = await runAction(clearMotionOrderResponseFormAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({});
  });
});
