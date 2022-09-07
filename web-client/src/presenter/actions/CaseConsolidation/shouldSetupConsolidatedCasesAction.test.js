import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldSetupConsolidatedCasesAction } from './shouldSetupConsolidatedCasesAction';

describe('shouldSetupConsolidatedCasesAction', () => {
  let pathYesStub;
  let pathNoStub;
  const { SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES } =
    applicationContext.getConstants();

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should set state.hideConsolidatedCaseCheckboxes to true when eventCode is one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES', async () => {
    const result = await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES[0],
        },
      },
    });

    expect(result.state.hideConsolidatedCaseCheckboxes).toBe(true);
  });

  it('should return the no path when the eventCode is one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES[0],
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should set state.hideConsolidatedCaseCheckboxes to false when eventCode is one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES', async () => {
    const result = await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: 'O',
        },
      },
    });

    expect(result.state.hideConsolidatedCaseCheckboxes).toBe(false);
  });

  it('should return the yes path when the eventCode is NOT one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: 'O',
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
