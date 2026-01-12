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

    const { renderKey, ...recallWithoutRenderKey } = Object.values(
      result.state.minuteSheetForm.caseMetadataSection.recalled,
    )[0];

    expect(renderKey).toBeDefined();
    expect(recallWithoutRenderKey).toEqual(
      mockMinuteSheet.caseRecord.recalls[0],
    );
    expect(result.state.minuteSheetForm).toMatchObject({
      ...mockMinuteSheetFormState,
      caseMetadataSection: {
        ...mockMinuteSheetFormState.caseMetadataSection,
        recalled: expect.any(Object),
      },
      options: {
        ...mockMinuteSheetFormState.options,
        irsPractitionerOptions: [],
      },
    });
  });
});
