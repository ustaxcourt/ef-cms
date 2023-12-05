import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isDocketEntryMultiDocketableAction } from './isDocketEntryMultiDocketableAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isDocketEntryMultiDocketableAction', () => {
  const mockDocketEntryId = '123333333';
  let pathYesStub;
  let pathNoStub;
  let {
    ENTERED_AND_SERVED_EVENT_CODES,
    SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  } = applicationContext.getConstants();

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES.forEach(eventCode => {
    it(`should return the no path when the eventCode ${eventCode} is one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES`, async () => {
      await runAction(isDocketEntryMultiDocketableAction, {
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
  });

  ENTERED_AND_SERVED_EVENT_CODES.forEach(eventCode => {
    it(`should return the no path when the eventCode ${eventCode} is one of ENTERED_AND_SERVED_EVENT_CODES`, async () => {
      await runAction(isDocketEntryMultiDocketableAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            eventCode,
          },
        },
      });

      expect(pathNoStub).toHaveBeenCalled();
    });
  });

  it('should return the yes path when the form eventCode is not one of SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES and ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await runAction(isDocketEntryMultiDocketableAction, {
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
    await runAction(isDocketEntryMultiDocketableAction, {
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
