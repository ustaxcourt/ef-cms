import { DOCKET_NUMBER_MATCHER } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Validates the new minute sheet modal form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path for success/error routing
 * @returns {object} the next path based on validation result
 */
export const validateNewMinuteSheetModalAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { docketNumber } = get(state.modal.form) || {};
  const trialSessionId = get(state.modal.trialSessionId);

  // Validate docket number format
  if (!docketNumber || !DOCKET_NUMBER_MATCHER.test(docketNumber)) {
    return path.error({
      errors: {
        docketNumber: 'Enter a valid docket number',
      },
    });
  }

  try {
    // Call interactor to validate case exists and is not already on trial session
    const caseInfo = await applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor(applicationContext, {
        docketNumber,
        trialSessionId,
      });

    return path.success({
      caseInfo,
    });
  } catch (error: any) {
    let errorMessage: string;

    if (error.responseCode === 404) {
      errorMessage = 'Case not found';
    } else if (error.responseCode === 400) {
      errorMessage = 'This case is already associated with this trial session';
    } else {
      errorMessage =
        error.message || 'An error occurred while validating the case';
    }

    return path.error({
      errors: {
        docketNumber: errorMessage,
      },
    });
  }
};
