import { isRespondentInCaseAction } from './isRespondentInCaseAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let yesStub;
let noStub;

describe('isRespondentInCaseAction', () => {
  beforeEach(() => {
    yesStub = sinon.stub();
    noStub = sinon.stub();

    presenter.providers.path = { no: noStub, yes: yesStub };
  });

  it('takes yes path when respondent is already in case', async () => {
    await runAction(isRespondentInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          respondents: [{ userId: 'abc' }],
        },
        modal: {
          respondentMatches: [{ userId: 'abc' }],
        },
      },
    });

    expect(yesStub.calledOnce).toEqual(true);
  });

  it('takes no path when respondent is not already in case', async () => {
    await runAction(isRespondentInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          respondents: [{ userId: 'abc' }],
        },
        modal: {
          respondentMatches: [{ userId: '123' }],
        },
      },
    });

    expect(noStub.calledOnce).toEqual(true);
  });
});
