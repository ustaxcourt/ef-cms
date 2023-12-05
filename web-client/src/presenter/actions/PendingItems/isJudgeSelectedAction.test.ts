import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { isJudgeSelectedAction } from './isJudgeSelectedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContextForClient;

describe('isJudgeSelectedAction', () => {
  const pathYesStub = jest.fn();
  const pathNoStub = jest.fn();

  beforeEach(() => {
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should call path.no when state.pendingReports.selectedJudge is undefined', async () => {
    await runAction(isJudgeSelectedAction, {
      modules: {
        presenter,
      },
      state: {
        pendingReports: { selectedJudge: undefined },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should call path.yes when state.pendingReports.selectedJudge is defined', async () => {
    await runAction(isJudgeSelectedAction, {
      modules: {
        presenter,
      },
      state: {
        pendingReports: { selectedJudge: 'Buch' },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
