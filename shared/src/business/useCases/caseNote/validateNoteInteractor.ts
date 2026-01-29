import { Note } from '../../entities/notes/Note';

/**
 * validateNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.note the note object
 * @returns {object} the errors or null
 */
export const validateNoteInteractor = ({
  note,
}: {
  note: { notes: string };
}) => {
  const errors = new Note(note).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
