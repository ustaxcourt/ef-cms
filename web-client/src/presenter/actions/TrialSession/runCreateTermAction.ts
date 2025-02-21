import { USER_MESSAGE_TYPES } from '@shared/business/entities/EntityConstants';
import { RawGenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';

export const runCreateTermAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps<RawGenerateSuggestedTermForm>) => {
  const {
    termEndDate,
    termName,
    termStartDate,
    maxSessionsPerLocation,
    maxSessionsPerWeek,
    smallCaseMinimumQuantity,
    smallCaseMaxQuantity,
    regularCaseMinimumQuantity,
    regularCaseMaxQuantity,
    hybridCaseMinimumQuantity,
    hybridCaseMaxQuantity,
    minimumCasesPerLocation,
  } = props;

  const { bufferArray, message } = await applicationContext
    .getUseCases()
    .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
      termEndDate,
      termName,
      termStartDate,
      maxSessionsPerLocation,
      maxSessionsPerWeek,
      smallCaseMinimumQuantity,
      smallCaseMaxQuantity,
      regularCaseMinimumQuantity,
      regularCaseMaxQuantity,
      hybridCaseMinimumQuantity,
      hybridCaseMaxQuantity,
      minimumCasesPerLocation,
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
