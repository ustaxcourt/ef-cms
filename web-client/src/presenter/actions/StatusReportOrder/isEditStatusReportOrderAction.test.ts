import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isEditStatusReportOrderAction } from './isEditStatusReportOrderAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isEditStatusReportOrderAction,', () => {
  const mockEditPath = jest.fn();
  const mockCreatePath = jest.fn();

  presenter.providers.path = {
    create: mockCreatePath,
    edit: mockEditPath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should use create path when new status report order', async () => {
    await runAction(isEditStatusReportOrderAction, {
      modules: {
        presenter,
      },
      props: {
        isEditing: true,
      },
    });

    expect(mockEditPath).toHaveBeenCalled();
  });

  it('should use edit path when existing status report order', async () => {
    await runAction(isEditStatusReportOrderAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(mockCreatePath).toHaveBeenCalled();
  });
});
