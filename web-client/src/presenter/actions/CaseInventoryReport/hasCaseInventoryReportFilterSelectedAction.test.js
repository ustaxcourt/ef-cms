import { hasCaseInventoryReportFilterSelectedAction } from './hasCaseInventoryReportFilterSelectedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('hasCaseInventoryReportFilterSelectedAction', () => {
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
          associatedJudge: 'Chief Judge',
        },
      },
    });

    expect(proceedMock).toBeCalled();
    expect(noMock).not.toBeCalled();
  });

  it('should return path.proceed if status is set on screenMetadata', async () => {
    await runAction(hasCaseInventoryReportFilterSelectedAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          status: 'New',
        },
      },
    });

    expect(proceedMock).toBeCalled();
    expect(noMock).not.toBeCalled();
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

    expect(noMock).toBeCalled();
    expect(proceedMock).not.toBeCalled();
  });
});
