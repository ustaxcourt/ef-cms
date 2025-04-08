import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateMotionOrderResponseFormAction } from './validateMotionOrderResponseFormAction';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

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
  // TODO 10586: success path is not being called
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
        form: {
          additionalOrderText: '',
          dueDate: '',
          motionOrderResponse: undefined,
          responseDate: '',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalled();
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
          motionOrderResponse: MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
          responseDate: 'invalid-date',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalled();
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });

  it('should fail validation when response type is invalid', async () => {
    await runAction(validateMotionOrderResponseFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          additionalOrderText: 'Test',
          dueDate: '2024-03-22',
          motionOrderResponse: 'INVALID_TYPE',
          responseDate: '2024-03-21',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalled();
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});