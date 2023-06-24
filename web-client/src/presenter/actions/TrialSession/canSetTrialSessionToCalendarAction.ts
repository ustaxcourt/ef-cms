import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates a trial session's eligibility to be calendared or not
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<object>} the next path based on if creation was successful or error
 */
export const canSetTrialSessionToCalendarAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const trialSession = get(state.trialSession);
  const { canSetAsCalendared, emptyFields, isRemote } = applicationContext
    .getUseCases()
    .canSetTrialSessionAsCalendaredInteractor(applicationContext, {
      trialSession,
    });

  if (canSetAsCalendared) {
    return path.yes();
  }

  const addressProperties = ['address1', 'city', 'state', 'postalCode'];
  const missingAddressProperties = addressProperties.filter(property =>
    emptyFields.includes(property),
  );
  const meetingProperties = [
    'chambersPhoneNumber',
    'joinPhoneNumber',
    'meetingId',
    'password',
  ];
  const missingMeetingProperties = meetingProperties.filter(property =>
    emptyFields.includes(property),
  );
  const missingFieldsForWarningMessage = [];

  if (missingAddressProperties.length > 0) {
    missingFieldsForWarningMessage.push('an address');
  }
  if (isRemote && missingMeetingProperties.length > 0) {
    missingFieldsForWarningMessage.push('remote proceeding information');
  }
  if (emptyFields.includes('judge')) {
    missingFieldsForWarningMessage.push('a judge');
  }

  if (!isRemote && emptyFields.includes('chambersPhoneNumber')) {
    missingFieldsForWarningMessage.push('a chambers phone number');
  }

  let formatFieldsForWarningMessage =
    missingFieldsForWarningMessage.join(' and ');

  if (missingFieldsForWarningMessage.length > 2) {
    formatFieldsForWarningMessage = `${missingFieldsForWarningMessage
      .slice(0, missingFieldsForWarningMessage.length - 1)
      .join(', ')}, and ${
      missingFieldsForWarningMessage[missingFieldsForWarningMessage.length - 1]
    }`;
  }

  return path.no({
    alertWarning: {
      message: `Provide ${formatFieldsForWarningMessage} to set this trial session.`,
    },
  });
};
