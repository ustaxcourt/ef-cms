import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { shouldSaveToConsolidatedGroupAction } from './shouldSaveToConsolidatedGroupAction';

describe('shouldSaveToConsolidatedGroupAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path if the given docketEntry is unservable and the current caseDetail is the lead case', () => {
    runAction(shouldSaveToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '101-20',
        },
        form: {
          eventCode: 'TE',
        },
      },
    });
    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path if the caseDetail is a leadCase and the docket entry is servable', () => {
    runAction(shouldSaveToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '101-20',
        },
        form: {
          eventCode: 'O',
        },
      },
    });
    expect(pathNoStub).toHaveBeenCalled();
  });

  it('returns the no path if the eventCode is TCRP, caseDetail is a leadCase, and the docket entry is unservable', () => {
    runAction(shouldSaveToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '101-20',
        },
        form: {
          eventCode: 'TCRP',
        },
      },
    });
    expect(pathNoStub).toHaveBeenCalled();
  });

  it('returns the no path if the case is not a lead case and the eventCode is unservable', () => {
    runAction(shouldSaveToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '103-20',
        },
        form: {
          eventCode: 'TE',
        },
      },
    });
    expect(pathNoStub).toHaveBeenCalled();
  });
});
