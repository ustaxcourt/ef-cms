import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validate the set for hearing form
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal.trialSessionId
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateSetForHearingAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { calendarNotes, trialSessionId }: {
    calendarNotes?: string;
    trialSessionId?: string;
  } = get(state.modal);

  const errors: { trialSessionId?: string; calendarNotes?: string } = {};
  if (!trialSessionId) {
    errors.trialSessionId = 'Select a Trial Session';
  }

  const appContext = applicationContext as unknown as IApplicationContext;
  const noteEntityErrors = applicationContext
    .getUseCases()
    .validateHearingNoteInteractor(appContext, {
      note: calendarNotes || '',
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
