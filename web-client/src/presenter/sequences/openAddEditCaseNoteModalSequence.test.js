import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { openAddEditCalendarNoteModalSequence } from './openAddEditCalendarNoteModalSequence';
import { presenter } from '../presenter-mock';

describe('openAddEditCalendarNoteModalSequence', () => {
  const mockNote = 'A note.';
  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      openAddEditCalendarNoteModalSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should set modal.note from props.note and modal.isEditing to true', async () => {
    await cerebralTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: mockNote,
    });

    expect(cerebralTest.getState('modal')).toMatchObject({
      isEditing: true,
      note: mockNote,
    });
  });

  it('set modal.showModal to AddEditCalendarNoteModal', async () => {
    await cerebralTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: mockNote,
    });

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'AddEditCalendarNoteModal',
    );
  });
});
