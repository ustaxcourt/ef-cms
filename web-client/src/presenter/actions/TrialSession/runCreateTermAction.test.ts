import {
  SUGGESTED_TRIAL_SESSION_TITLES,
  USER_MESSAGE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { runCreateTermAction } from './runCreateTermAction';

describe('runCreateTermAction', () => {
  let successStub;
  let errorStub;
  let warningStub;
  let mockBufferData;
  let mockExcelJSBuffer;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();
    warningStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
      warning: warningStub,
    };

    mockBufferData = new Uint8Array([65, 66, 67]);
    mockExcelJSBuffer = { data: mockBufferData };
  });

  it('should call the success path when a trial session calendar is generated without any errors', async () => {
    const mockMessage = {
      message: SUGGESTED_TRIAL_SESSION_TITLES.success,
      type: USER_MESSAGE_TYPES.success,
    };

    applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor.mockReturnValue({
        bufferArray: mockExcelJSBuffer,
        message: mockMessage,
      });

    await runAction(runCreateTermAction, {
      modules: { presenter },
      props: {
        termEndDate: '03/31/2050',
        termName: 'Test term',
        termStartDate: '01/01/2050',
      },
    });

    expect(successStub).toHaveBeenCalledWith({
      alertSuccess: mockMessage,
      bufferArray: mockExcelJSBuffer,
      termName: 'Test term',
    });
  });

  it('should call the error path when there is no data in the ExcelJS Buffer instance returned by the interactor', async () => {
    const mockMessage = {
      message:
        'There are no trial sessions to schedule within the dates provided.',
      title: SUGGESTED_TRIAL_SESSION_TITLES.invalid,
      type: USER_MESSAGE_TYPES.error,
    };
    applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor.mockReturnValue({
        bufferArray: { data: undefined },
        message: mockMessage,
      });

    await runAction(runCreateTermAction, {
      modules: { presenter },
      props: {
        termEndDate: '03/31/2050',
        termName: 'test term',
        termStartDate: '01/01/2050',
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      alertError: mockMessage,
    });
  });

  it('should call the warning path when the interactor returns a warning', async () => {
    const mockMessage = {
      message: 'You broke some constraints',
      title: SUGGESTED_TRIAL_SESSION_TITLES.warning,
      type: USER_MESSAGE_TYPES.warning,
    };
    applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor.mockReturnValue({
        bufferArray: mockExcelJSBuffer,
        message: mockMessage,
      });

    await runAction(runCreateTermAction, {
      modules: { presenter },
      props: {
        termEndDate: '03/31/2050',
        termName: 'Test term with warnings',
        termStartDate: '01/01/2050',
      },
    });

    expect(warningStub).toHaveBeenCalledWith({
      alertWarning: mockMessage,
      bufferArray: mockExcelJSBuffer,
      termName: 'Test term with warnings',
    });
  });
});
