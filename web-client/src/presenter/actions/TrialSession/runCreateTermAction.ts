import { USER_MESSAGE_TYPES } from '@shared/business/entities/EntityConstants';
import { CreateTermParams } from '@shared/types/CreateTermParams';

export const runCreateTermAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps<
  CreateTermParams & {
    termName: string;
  }
>) => {
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
  } = props;

  const { bufferArray, message } = await applicationContext
    .getUseCases()
    .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
      termEndDate,
      termStartDate,
      maxSessionsPerLocation,
      maxSessionsPerWeek,
      smallCaseMinimumQuantity,
      smallCaseMaxQuantity,
      regularCaseMinimumQuantity,
      regularCaseMaxQuantity,
      hybridCaseMinimumQuantity,
      hybridCaseMaxQuantity,
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
