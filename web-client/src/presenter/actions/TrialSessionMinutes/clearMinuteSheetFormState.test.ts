import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearMinuteSheetFormStateAction } from './clearMinuteSheetFormState';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearMinuteSheetFormStateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should clear the minute sheet form state', async () => {
    const result = await runAction(clearMinuteSheetFormStateAction, {
      modules: {
        presenter,
      },
      state: {
        minuteSheetForm: mockMinuteSheetFormState,
      },
    });

    expect(result.state.minuteSheetForm).toEqual({});
  });

  it('should handle clearing an already empty state', async () => {
    const result = await runAction(clearMinuteSheetFormStateAction, {
      modules: {
        presenter,
      },
      state: {
        minuteSheetForm: {},
      },
    });

    expect(result.state.minuteSheetForm).toEqual({});
  });
});
