import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { showSealedToPublicCaseAction } from './showSealedToPublicCaseAction';

let yesMock;
let noMock;

describe('showSealedToPublicCaseAction', () => {
  beforeAll(() => {
    yesMock = jest.fn();
    noMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };
  });

  it('should call the yes path when the case is sealed and the user is not associated with the case', async () => {
    await runAction(showSealedToPublicCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { isSealed: true },
        isAssociated: false,
      },
    });

    expect(yesMock).toHaveBeenCalled();
  });

  it('should call the no path when the case is NOT sealed and the user is associated with the case', async () => {
    await runAction(showSealedToPublicCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { isSealed: false },
        isAssociated: true,
      },
    });

    expect(noMock).toHaveBeenCalled();
  });

  it('should call the no path when the case is sealed and the user is associated with the case', async () => {
    await runAction(showSealedToPublicCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { isSealed: true },
        isAssociated: true,
      },
    });

    expect(noMock).toHaveBeenCalled();
  });

  it('should call the no path when the case is NOT sealed and the user is NOT associated with the case', async () => {
    await runAction(showSealedToPublicCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { isSealed: false },
        isAssociated: false,
      },
    });

    expect(noMock).toHaveBeenCalled();
  });
});
