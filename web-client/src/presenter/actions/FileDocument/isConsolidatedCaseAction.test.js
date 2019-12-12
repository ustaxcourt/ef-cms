import { isConsolidatedCaseAction } from './isConsolidatedCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let yesMock;
let noMock;

describe('isConsolidatedCaseAction', () => {
  beforeEach(() => {
    yesMock = jest.fn();
    noMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };
  });
  it('Should return the true path when a case has a leadCaseId', async () => {
    await runAction(isConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
          leadCaseId: '1234',
        },
      },
    });

    expect(yesMock).toHaveBeenCalled();
  });

  it('Should return the false path when a case does NOT have a leadCaseId', async () => {
    await runAction(isConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
      },
    });

    expect(noMock).toHaveBeenCalled();
  });
});
