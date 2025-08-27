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

  it('should add a new empty row to exhibits section after the specified index', async () => {
    const existingRow1 = {
      description: 'First exhibit',
      renderKey: '123',
    };
    const existingRow2 = {
      description: 'Second exhibit',
      renderKey: '456',
    };
    const result = await runAction(addMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        index: 0, // Insert after the first row
        name: 'exhibits',
        section: 'exhibitsSection',
      },
      state: {
        minuteSheetForm: {
          ...mockMinuteSheetFormState,
          exhibitsSection: {
            exhibits: {
              a: existingRow1,
              b: existingRow2,
            },
          },
        },
      },
    });

    const rows = result.state.minuteSheetForm.exhibitsSection.exhibits;
    expect(Object.keys(rows)).toHaveLength(3);
    const addedRow = Object.values(
      result.state.minuteSheetForm.exhibitsSection.exhibits,
    )[1];
    expect(addedRow).toMatchObject({
      description: '',
      note: '',
      status: '',
    });
    expect(addedRow.renderKey).toBeDefined();
  });
});
