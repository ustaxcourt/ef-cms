import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { hasCaseInventoryReportFilterSelectedAction } from './hasCaseInventoryReportFilterSelectedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('hasCaseInventoryReportFilterSelectedAction', () => {
  const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

  const proceedMock = jest.fn();
  const noMock = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      no: noMock,
      proceed: proceedMock,
    };
  });

  it('should return path.proceed if associatedJudge is set on screenMetadata', async () => {
    await runAction(hasCaseInventoryReportFilterSelectedAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          associatedJudge: CHIEF_JUDGE,
        },
      },
    });

    expect(proceedMock).toHaveBeenCalled();
    expect(noMock).not.toHaveBeenCalled();
  });

  it('should return path.proceed if status is set on screenMetadata', async () => {
    await runAction(hasCaseInventoryReportFilterSelectedAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          status: STATUS_TYPES.new,
        },
      },
    });

    expect(proceedMock).toHaveBeenCalled();
    expect(noMock).not.toHaveBeenCalled();
  });

  it('should return path.no if associatedJudge and status are not set on screenMetadata', async () => {
    await runAction(hasCaseInventoryReportFilterSelectedAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(noMock).toHaveBeenCalled();
    expect(proceedMock).not.toHaveBeenCalled();
  });
});
