import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
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
        minuteSheet: mockMinuteSheet,
        judgeOptions: {
          '1': { fullName: '', title: '', userId: '1' },
        },
      },
      state: {
        minuteSheetForm: {},
      },
    });

    expect(result.state.minuteSheetForm).toEqual({
      ...mockMinuteSheetFormState,
      options: {
        ...mockMinuteSheetFormState.options,
        irsPractitionerOptions: [],
      },
    });
  });

  it('should create a deep clone of the minute sheet form state', async () => {
    const result = await runAction(setExistingMinuteSheetFormAction, {
      modules: {
        presenter,
      },
      props: {
        minuteSheet: mockMinuteSheet,
        judgeOptions: {
          '1': { fullName: '', title: '', userId: '1' },
        },
      },
      state: {
        minuteSheetForm: {},
      },
    });

    const expectedMinuteSheetFormState = {
      ...mockMinuteSheetFormState,
      options: {
        ...mockMinuteSheetFormState.options,
        irsPractitionerOptions: [],
      },
    };

    expect(result.state.minuteSheetForm).not.toBe(mockMinuteSheet);
    expect(result.state.minuteSheetForm).toEqual(expectedMinuteSheetFormState);
  });
});
