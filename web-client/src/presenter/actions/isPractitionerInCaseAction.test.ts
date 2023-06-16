import { isPractitionerInCaseAction } from './isPractitionerInCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

let yesStub;
let noStub;

describe('isPractitionerInCaseAction', () => {
  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('takes yes path when practitioner is already in case', async () => {
    await runAction(isPractitionerInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: 'abc' }],
        },
        modal: {
          practitionerMatches: [{ userId: 'abc' }],
        },
      },
    });

    expect(yesStub.mock.calls.length).toEqual(1);
  });

  it('takes no path when practitioner is not already in case', async () => {
    await runAction(isPractitionerInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: 'abc' }],
        },
        modal: {
          practitionerMatches: [{ userId: '123' }],
        },
      },
    });

    expect(noStub.mock.calls.length).toEqual(1);
  });
});
