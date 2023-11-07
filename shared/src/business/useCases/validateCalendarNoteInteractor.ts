import { CalendarNote } from '../entities/notes/CalendarNote';

/**
 * validateCalendarNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.note the note string
 * @returns {object} the errors or null
 */
export const validateCalendarNoteInteractor = ({ note }: { note: string }) => {
  return new CalendarNote({ note }).getFormattedValidationErrors();
};
