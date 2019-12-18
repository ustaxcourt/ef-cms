import { canFileInConsolidatedCasesAction } from './canFileInConsolidatedCasesAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('canFileInConsolidatedCasesAction', () => {
  let yesStub;
  let noStub;

  beforeEach(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should select yes when lead case id exists and the user has the FILE_IN_CONSOLIDATED permisssion', async () => {
    await runAction(canFileInConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          leadCaseId: '123',
        },
        permissions: {
          FILE_IN_CONSOLIDATED: true,
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call no path when no lead case id exists', async () => {
    await runAction(canFileInConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        permissions: {
          FILE_IN_CONSOLIDATED: true,
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('should call no path when the user does not have the FILE_IN_CONSOLIDATED permission', async () => {
    await runAction(canFileInConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          leadCaseId: '123',
        },
        permissions: {
          FILE_IN_CONSOLIDATED: false,
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
