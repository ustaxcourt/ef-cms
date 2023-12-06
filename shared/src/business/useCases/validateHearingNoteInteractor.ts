import { HearingNote } from '../entities/notes/HearingNote';

/**
 * validateHearingNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.note the note string
 * @returns {object} the errors or null
 */
export const validateHearingNoteInteractor = (
  applicationContext: IApplicationContext,
  { note }: { note: string },
) => {
  const errors = new HearingNote({ note }).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
