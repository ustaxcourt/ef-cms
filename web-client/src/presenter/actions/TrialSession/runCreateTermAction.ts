import { MESSAGE_TYPES } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export const runCreateTermAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = props;

  const { bufferArray, message } = await applicationContext
    .getUseCases()
    .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
      termEndDate,
      termStartDate,
    });

  switch (message.type) {
    case MESSAGE_TYPES.error:
      return path.error({
        alertError: message,
      });
    case MESSAGE_TYPES.warning:
      return path.warning({ alertWarning: message, bufferArray, termName });
    case MESSAGE_TYPES.success:
      return path.success({ alertSuccess: message, bufferArray, termName });
  }
};
