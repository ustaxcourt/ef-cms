import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateMotionOrderResponseFormAction } from './validateMotionOrderResponseFormAction';
import {
  createISODateString,
  formatNow,
  FORMATS,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';

describe('validateMotionOrderResponseFormAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    mockSuccessPath.mockReset();
    mockErrorPath.mockReset();
  });

  it('should validate successfully when all required fields are present', async () => {
    const today = formatNow(FORMATS.YYYYMMDD);
    await runAction(validateMotionOrderResponseFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          responseDate: today,
          orderType: MOTION_ORDER_RESPONSE_OPTIONS.orderType,
          strickenFromTrialSession: false,
          issueOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
        },
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should fail validation when required fields are missing', async () => {
    await runAction(validateMotionOrderResponseFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: {
          issueOrderFor: 'Select on which cases to file this order',
          responseDate: 'Response Date is required.',
        },
      }),
    );
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });

  it('should fail validation when dates are invalid', async () => {
    await runAction(validateMotionOrderResponseFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          additionalOrderText: 'Test',
          dueDate: 'invalid-date',
          issueOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY,
          motionOrderResponse:
            MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
          responseDate: 'invalid-date',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: {
          dueDate: 'Enter a valid date',
          responseDate: 'Enter a valid date',
        },
      }),
    );
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });

  it('should fail validation when response type is invalid', async () => {
    await runAction(validateMotionOrderResponseFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          issueOrderFor:
            MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY,
          additionalOrderText: 'Test',
          dueDate: getBusinessDateInFuture({
            numberOfDays: 4,
            outputFormat: FORMATS.YYYYMMDD,
            startDate: createISODateString(),
          }),
          motionOrderResponse: 'INVALID_TYPE',
          responseDate: getBusinessDateInFuture({
            numberOfDays: 2,
            outputFormat: FORMATS.YYYYMMDD,
            startDate: createISODateString(),
          }),
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: {
          motionOrderResponse:
            'Order reply must be one of [Order Reply, Order Reply/SR]',
        },
      }),
    );
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});
