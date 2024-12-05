import { USER_MESSAGE_TYPES } from '@shared/business/entities/EntityConstants';

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
    case USER_MESSAGE_TYPES.error:
      return path.error({
        alertError: message,
      });
    case USER_MESSAGE_TYPES.warning:
      return path.warning({ alertWarning: message, bufferArray, termName });
    case USER_MESSAGE_TYPES.success:
      return path.success({ alertSuccess: message, bufferArray, termName });
  }
};
