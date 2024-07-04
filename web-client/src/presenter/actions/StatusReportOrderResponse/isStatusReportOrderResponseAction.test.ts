import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isStatusReportOrderResponseAction } from './isStatusReportOrderResponseAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isStatusReportOrderResponseAction,', () => {
  const mockIsStatusReportOrderResponsePath = jest.fn();
  const mockIsNotStatusReportOrderResponsePath = jest.fn();

  presenter.providers.path = {
    isNotStatusReportOrderResponse: mockIsNotStatusReportOrderResponsePath,
    isStatusReportOrderResponse: mockIsStatusReportOrderResponsePath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should use status report order response path when document is status report order response with correct permissions', async () => {
    await runAction(isStatusReportOrderResponseAction, {
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
          ORDER_RESPONSE: true,
        },
      },
    });

    expect(mockIsStatusReportOrderResponsePath).toHaveBeenCalled();
  });

  it('should not use status report order response path when document is status report order response with incorrect permissions', async () => {
    await runAction(isStatusReportOrderResponseAction, {
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
          ORDER_RESPONSE: false,
        },
      },
    });

    expect(mockIsNotStatusReportOrderResponsePath).toHaveBeenCalled();
  });

  it('should use status report order response path when document is not status report order response with correct permissions', async () => {
    await runAction(isStatusReportOrderResponseAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          draftOrderState: {},
        },
        permissions: {
          ORDER_RESPONSE: true,
        },
      },
    });

    expect(mockIsNotStatusReportOrderResponsePath).toHaveBeenCalled();
  });
});
