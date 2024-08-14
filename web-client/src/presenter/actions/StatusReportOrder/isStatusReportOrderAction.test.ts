import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isStatusReportOrderAction } from './isStatusReportOrderAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isStatusReportOrderAction,', () => {
  const mockIsStatusReportOrderPath = jest.fn();
  const mockIsNotStatusReportOrderPath = jest.fn();

  presenter.providers.path = {
    isNotStatusReportOrder: mockIsNotStatusReportOrderPath,
    isStatusReportOrder: mockIsStatusReportOrderPath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should use status report order path when document is status report order with correct permissions', async () => {
    await runAction(isStatusReportOrderAction, {
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

  it('should not use status report order path when document is status report order with incorrect permissions', async () => {
    await runAction(isStatusReportOrderAction, {
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

    expect(mockIsNotStatusReportOrderPath).toHaveBeenCalled();
  });

  it('should use status report order path when document is not status report order with correct permissions', async () => {
    await runAction(isStatusReportOrderAction, {
      modules: {
        presenter,
      },
      state: {
        permissions: {
          STATUS_REPORT_ORDER: true,
        },
      },
    });

    expect(mockIsNotStatusReportOrderPath).toHaveBeenCalled();
  });
});
