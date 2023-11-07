import { validateCalendarNoteInteractor } from './validateCalendarNoteInteractor';

describe('validateCalendarNoteInteractor', () => {
  it('returns null on no errors', () => {
    const errors = validateCalendarNoteInteractor({
      note: 'hello world',
    });

    expect(errors).toBeNull();
  });
});
