import { validateNoteInteractor } from './validateNoteInteractor';

describe('validateNoteInteractor', () => {
  it('returns the expected errors object on an empty note', () => {
    const errors = validateNoteInteractor({
      //@ts-expect-error
      note: {},
    });

    expect(Object.keys({ ...errors })).toEqual(['notes']);
  });

  it('returns null on no errors', () => {
    const errors = validateNoteInteractor({
      note: {
        notes: 'hello world',
      },
    });

    expect(errors).toBeNull();
  });
});
