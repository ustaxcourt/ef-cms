import { addMinuteSheetFormRowAction } from './addMinuteSheetFormRowAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { mockMinuteSheetFormState } from '@web-client/presenter/actions/TrialSessionMinutes/mockMinuteSheetFormState';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addMinuteSheetFormRowAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should add a new empty row to motions section', async () => {
    const result = await runAction(addMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        name: 'motions',
        section: 'motionsSection',
      },
      state: {
        minuteSheetForm: {
          ...mockMinuteSheetFormState,
          motionsSection: {
            motions: {},
          },
        },
      },
    });

    const addedRow = Object.values(
      result.state.minuteSheetForm.motionsSection.motions,
    )[0];
    expect(addedRow).toMatchObject({
      date: '',
      filedBy: '',
      note: '',
      oralMotion: false,
      status: '',
      type: '',
    });
    expect(addedRow.renderKey).toBeDefined();
  });

  it('should add a new empty row to exhibits section', async () => {
    const result = await runAction(addMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        name: 'exhibits',
        section: 'exhibitsSection',
      },
      state: {
        minuteSheetForm: {
          ...mockMinuteSheetFormState,
          exhibitsSection: {
            exhibits: {},
          },
        },
      },
    });

    const addedRow = Object.values(
      result.state.minuteSheetForm.exhibitsSection.exhibits,
    )[0];
    expect(addedRow).toMatchObject({
      description: '',
      note: '',
      status: '',
    });
    expect(addedRow.renderKey).toBeDefined();
  });

  it('should preserve existing rows when adding a new row', async () => {
    const existingRow = {
      description: 'Existing exhibit',
      note: 'Some note',
      renderKey: '123',
      status: 'pending',
    };

    const result = await runAction(addMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        name: 'exhibits',
        section: 'exhibitsSection',
      },
      state: {
        minuteSheetForm: {
          ...mockMinuteSheetFormState,
          exhibitsSection: {
            exhibits: {
              '123': existingRow,
            },
          },
        },
      },
    });

    const rows = result.state.minuteSheetForm.exhibitsSection.exhibits;
    expect(Object.keys(rows)).toHaveLength(2);
    expect(rows['123']).toEqual(existingRow);
  });
});
