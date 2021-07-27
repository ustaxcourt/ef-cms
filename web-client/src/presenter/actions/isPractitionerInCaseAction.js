import { state } from 'cerebral';

/**
 * changes the path based on if the practitioner is already in the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for accessing local storage
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @returns {string} the scanner source name from local storage
 */
export const isPractitionerInCaseAction = ({ get, path }) => {
  const caseDetail = get(state.caseDetail);
  const privatePractitioners = get(state.modal.practitionerMatches);

  if (
    privatePractitioners.length === 1 &&
    caseDetail.privatePractitioners.find(
      practitioner => practitioner.userId === privatePractitioners[0].userId,
    )
  ) {
    return path.yes();
  } else {
    return path.no();
  }
};
