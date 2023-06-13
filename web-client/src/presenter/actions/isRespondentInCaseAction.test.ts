import { isRespondentInCaseAction } from './isRespondentInCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

let yesStub;
let noStub;

describe('isRespondentInCaseAction', () => {
  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = { no: noStub, yes: yesStub };
  });

  it('takes yes path when respondent is already in case', async () => {
    await runAction(isRespondentInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: 'abc' }],
        },
        modal: {
          respondentMatches: [{ userId: 'abc' }],
        },
      },
    });

    expect(yesStub.mock.calls.length).toEqual(1);
  });

  it('takes no path when respondent is not already in case', async () => {
    await runAction(isRespondentInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: 'abc' }],
        },
        modal: {
          respondentMatches: [{ userId: '123' }],
        },
      },
    });

    expect(noStub.mock.calls.length).toEqual(1);
  });
});
