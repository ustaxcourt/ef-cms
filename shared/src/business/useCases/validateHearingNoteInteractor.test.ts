import { validateHearingNoteInteractor } from './validateHearingNoteInteractor';

describe('validateHearingNoteInteractor', () => {
  it('returns a defined errors object if the note is greater than 200 characters', () => {
    const errors = validateHearingNoteInteractor({
      note: 'a'.repeat(202),
    });
    expect(errors).toEqual({
      note: 'Limit is 200 characters. Enter 200 or fewer characters.',
    });
  });

  it('returns a defined errors object when note is empty', () => {
    const errors = validateHearingNoteInteractor({
      note: '',
    });

    expect(errors).toEqual({
      note: 'Add a note',
    });
  });
  
  it('returns null when note is defined', () => {
    const result = validateHearingNoteInteractor({
      note: 'this is a note',
    });

    expect(result).toEqual(null);
  });
});
