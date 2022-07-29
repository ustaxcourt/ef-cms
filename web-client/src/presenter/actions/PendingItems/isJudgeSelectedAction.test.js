import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { isJudgeSelectedAction } from './isJudgeSelectedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

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
