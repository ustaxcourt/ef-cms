import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getOrderTypeAction } from './getOrderTypeAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';

describe('getOrderTypeAction,', () => {
  const mockIsStatusReportOrderPath = jest.fn();
  const mockIsStandardOrderPath = jest.fn();
  const mockIsMotionOrderResponsePath = jest.fn();

  presenter.providers.path = {
    isStandardOrder: mockIsStandardOrderPath,
    isStatusReportOrder: mockIsStatusReportOrderPath,
    isMotionOrderResponse: mockIsMotionOrderResponsePath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should use status report order path when document is status report order with correct permissions', async () => {
    await runAction(getOrderTypeAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          draftOrderState: {
            docketEntryDescription: 'Order',
          },
        },
        permissions: {
          STATUS_REPORT_ORDER: true,
        },
      },
    });

    expect(mockIsStatusReportOrderPath).toHaveBeenCalled();
  });

  it('should use standard report order path when document is status report order with incorrect permissions', async () => {
    await runAction(getOrderTypeAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          draftOrderState: {
            docketEntryDescription: 'Order',
          },
        },
        permissions: {
          STATUS_REPORT_ORDER: false,
        },
      },
    });

    expect(mockIsStandardOrderPath).toHaveBeenCalled();
  });

  it('should use motion response order path when document is motion response order with correct permissions', async () => {
    await runAction(getOrderTypeAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          draftOrderState: {
            orderType: MOTION_ORDER_RESPONSE_OPTIONS.orderType,
          },
        },
        permissions: {
          MOTION_ORDER_RESPONSE: true,
        },
      },
    });

    expect(mockIsMotionOrderResponsePath).toHaveBeenCalled();
  });

  it('should use standard report order path when document is not status report order with correct permissions', async () => {
    await runAction(getOrderTypeAction, {
      modules: {
        presenter,
      },
      state: {
        permissions: {
          STATUS_REPORT_ORDER: true,
        },
      },
    });

    expect(mockIsStandardOrderPath).toHaveBeenCalled();
  });
});
