import { isGlobalReportAction } from './isGlobalReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

let yesStub;
let noStub;

describe('isGlobalReportAction', () => {
  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = { no: noStub, yes: yesStub };
  });

  it('takes yes path when respondent is already in case', async () => {
    await runAction(isGlobalReportAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(yesStub.mock.calls.length).toEqual(1);
  });

  it('takes no path when respondent is not already in case', async () => {
    await runAction(isGlobalReportAction, {
      modules: {
        presenter,
      },
      props: {
        caseIdFilter: 'abc',
      },
    });

    expect(noStub.mock.calls.length).toEqual(1);
  });
});
