import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { mockMinuteSheetFormState } from './minuteSheetMocks';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setExistingMinuteSheetFormAction } from './setExistingMinuteSheetFormAction';

describe('setExistingMinuteSheetFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set the minute sheet form state from props', async () => {
    const result = await runAction(setExistingMinuteSheetFormAction, {
      modules: {
        presenter,
      },
      props: {
        minuteSheet: mockMinuteSheetFormState,
      },
      state: {
        minuteSheetForm: {},
      },
    });

    expect(result.state.minuteSheetForm).toEqual(mockMinuteSheetFormState);
  });

  it('should create a deep clone of the minute sheet form state', async () => {
    const result = await runAction(setExistingMinuteSheetFormAction, {
      modules: {
        presenter,
      },
      props: {
        minuteSheet: mockMinuteSheetFormState,
      },
      state: {
        minuteSheetForm: {},
      },
    });

    expect(result.state.minuteSheetForm).not.toBe(mockMinuteSheetFormState);
    expect(result.state.minuteSheetForm).toEqual(mockMinuteSheetFormState);
  });

  it('should handle empty minute sheet data', async () => {
    const result = await runAction(setExistingMinuteSheetFormAction, {
      modules: {
        presenter,
      },
      props: {
        minuteSheet: {},
      },
      state: {
        minuteSheetForm: mockMinuteSheetFormState,
      },
    });

    expect(result.state.minuteSheetForm).toEqual({});
  });
});
