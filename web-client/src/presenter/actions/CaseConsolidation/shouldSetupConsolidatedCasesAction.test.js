import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldSetupConsolidatedCasesAction } from './shouldSetupConsolidatedCasesAction';

describe('shouldSetupConsolidatedCasesAction', () => {
  const mockDocketEntryId = '123333333';
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

  it.only('should return the no path when the eventCode is one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: 'M083',
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the no path when the eventCode is one of ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: 'ODJ',
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the yes path when the form eventCode is not one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES and ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          eventCode: 'A',
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return the yes path when the docket entry eventCode is not one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES and ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId, eventCode: 'A' }],
        },
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
