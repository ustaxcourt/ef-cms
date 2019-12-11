import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { isConsolidatedCaseAction } from './isConsolidatedCaseAction';

describe('isConsolidatedCaseAction', () => {
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

  it('should select yes when lead case id exists', async () => {
    await runAction(isConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          leadCaseId: '123',
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call no path when no lead case id exists', async () => {
    await runAction(isConsolidatedCaseAction, {
      modules: {
        presenter,
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
