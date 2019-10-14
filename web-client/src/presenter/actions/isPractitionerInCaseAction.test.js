import { isPractitionerInCaseAction } from './isPractitionerInCaseAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let yesStub;
let noStub;

describe('isPractitionerInCaseAction', () => {
  beforeEach(() => {
    yesStub = sinon.stub();
    noStub = sinon.stub();

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
          practitioners: [{ userId: 'abc' }],
        },
        modal: {
          practitionerMatches: [{ userId: 'abc' }],
        },
      },
    });

    expect(yesStub.calledOnce).toEqual(true);
  });

  it('takes no path when practitioner is not already in case', async () => {
    await runAction(isPractitionerInCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          practitioners: [{ userId: 'abc' }],
        },
        modal: {
          practitionerMatches: [{ userId: '123' }],
        },
      },
    });

    expect(noStub.calledOnce).toEqual(true);
  });
});
