import { applicationContext } from '../test/createTestApplicationContext';
import { validateCalendarNoteInteractor } from './validateCalendarNoteInteractor';

describe('validateCalendarNoteInteractor', () => {
  it('returns null on no errors', () => {
    const errors = validateCalendarNoteInteractor(applicationContext, {
      note: 'hello world',
    });

    expect(errors).toBeNull();
  });
});
