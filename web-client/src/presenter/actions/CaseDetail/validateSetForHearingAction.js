import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate the set for hearing form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal.trialSessionId
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateSetForHearingAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { calendarNotes, trialSessionId } = get(state.modal);

  let errors = {};
  if (!trialSessionId) {
    errors.trialSessionId = 'Select a Trial Session';
  }

  const noteEntityErrors = applicationContext
    .getUseCases()
    .validateHearingNoteInteractor(applicationContext, {
      note: calendarNotes,
    });

  if (noteEntityErrors?.note) {
    errors.calendarNotes = noteEntityErrors.note;
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
