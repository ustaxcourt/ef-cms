import { state } from 'cerebral';

/**
 * takes the yes path if either contact primary or secondary email has been updated on the form;
 * takes the no path otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @returns {object} continue path for the sequence
 */
export const hasUpdatedPetitionerEmailAction = async ({ get, path }) => {
  const caseDetail = get(state.caseDetail);
  const { contact: formContact } = get(state.form);

  const caseContact = caseDetail.petitioners.find(
    p => p.contactId === formContact.contactId,
  );

  if (caseContact.email !== formContact.email) {
    return path.yes();
  }

  return path.no();
};
