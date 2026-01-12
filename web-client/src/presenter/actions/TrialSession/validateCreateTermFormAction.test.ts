import { runAction } from '@web-client/presenter/test.cerebral';
import {
  STATE_KEYS,
  SUGGESTED_TRIAL_SESSION_TITLES,
  USER_MESSAGE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { validateCreateTermFormAction } from '@web-client/presenter/actions/TrialSession/validateCreateTermFormAction';
import { RawGenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';
import { presenter } from '@web-client/presenter/presenter-mock';
import {
  getBusinessDateInFuture,
  FORMATS,
  createISODateString,
} from '@shared/business/utilities/DateHandler';

describe('validateCreateTermFormAction', () => {
  const termEndDate = getBusinessDateInFuture({
    numberOfDays: 360,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(),
  });

  const termStartDate = getBusinessDateInFuture({
    numberOfDays: 1,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(),
  });

  const VALID_TERM_FORM: RawGenerateSuggestedTermForm = {
    termStartDate,
    termEndDate,
    termName: 'TEST_TERM_NAME',
    maxSessionsPerLocation: 1,
    maxSessionsPerWeek: 1,
    smallCaseMinimumQuantity: 1,
    smallCaseMaxQuantity: 1,
    regularCaseMinimumQuantity: 1,
    regularCaseMaxQuantity: 1,
    hybridCaseMinimumQuantity: 1,
    hybridCaseMaxQuantity: 1,
  };

  const path = {
    error: jest.fn(),
    success: jest.fn(),
  };

  beforeEach(() => {
    path.error = jest.fn();
    path.success = jest.fn();

    presenter.providers.path = path;
  });

  it('should call the "success" path when a valid form is passed', async () => {
    await runAction(validateCreateTermFormAction, {
      modules: {
        presenter,
      },
      state: {
        [STATE_KEYS.TERM_BUILDER_INFORMATION]: VALID_TERM_FORM,
      },
    });

    const successCalls = path.success.mock.calls;
    expect(successCalls.length).toEqual(1);

    const errorCalls = path.error.mock.calls;
    expect(errorCalls.length).toEqual(0);
  });

  it('should call the "error" path when an invalid form is passed', async () => {
    await runAction(validateCreateTermFormAction, {
      modules: {
        presenter,
      },
      state: {
        [STATE_KEYS.TERM_BUILDER_INFORMATION]: {},
      },
    });

    const successCalls = path.success.mock.calls;
    expect(successCalls.length).toEqual(0);

    const errorCalls = path.error.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toMatchObject({
      alertError: {
        scrollToErrorNotification: true,
        title: SUGGESTED_TRIAL_SESSION_TITLES.validation,
        type: USER_MESSAGE_TYPES.error,
      },
    });
  });
});
