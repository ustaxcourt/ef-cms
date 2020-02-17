import { isGlobalReportAction } from './isGlobalReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let yesStub;
let noStub;

describe('isGlobalReportAction', () => {
  beforeEach(() => {
    yesStub = sinon.stub();
    noStub = sinon.stub();

    presenter.providers.path = { no: noStub, yes: yesStub };
  });

  it('takes yes path when respondent is already in case', async () => {
    await runAction(isGlobalReportAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(yesStub.calledOnce).toEqual(true);
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

    expect(noStub.calledOnce).toEqual(true);
  });
});
