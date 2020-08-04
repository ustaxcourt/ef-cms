import { isConsolidatedCaseAction } from './isConsolidatedCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isConsolidatedCaseAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should select yes when lead docket number exists', async () => {
    await runAction(isConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          leadDocketNumber: '123',
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call no path when no lead docket number exists', async () => {
    await runAction(isConsolidatedCaseAction, {
      modules: {
        presenter,
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
