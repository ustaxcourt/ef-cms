import { Note } from '../../entities/notes/Note';

/**
 * validateNote
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.note the note object
 * @returns {object} the errors or null
 */
export const validateNoteInteractor = (
  applicationContext: IApplicationContext,
  { note }: { note: { notes?: string } },
) => {
  const errors = new Note(note, {
    applicationContext,
  }).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
