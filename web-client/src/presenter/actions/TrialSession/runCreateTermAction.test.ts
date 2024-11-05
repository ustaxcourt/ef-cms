import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { runCreateTermAction } from './runCreateTermAction';

describe('runCreateTermAction', () => {
  let successStub;
  let errorStub;
  let mockBufferData;
  let mockExcelJSBuffer;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    mockBufferData = new Uint8Array([65, 66, 67]);
    mockExcelJSBuffer = { data: mockBufferData };
  });

  it('should call the success path when a trial session calendar is generated without any errors', async () => {
    applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor.mockReturnValue({
        bufferArray: mockExcelJSBuffer,
        message: 'Test',
      });

    await runAction(runCreateTermAction, {
      modules: { presenter },
      props: {
        termEndDate: '03/31/2050',
        termName: 'test term',
        termStartDate: '01/01/2050',
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('should call the error path when there is no data in the ExcelJS Buffer instance returned by the interactor', async () => {
    const errorMessage = 'Test error';
    applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor.mockReturnValue({
        bufferArray: { data: undefined },
        message: errorMessage,
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
      alertError: {
        message: errorMessage,
        title: 'Create term error.',
      },
    });
  });

  it('should call the error path when the interactor throws an error', async () => {
    const errorMessage = 'Test error';
    applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor.mockImplementation(
        () => {
          throw new Error(errorMessage);
        },
      );

    await runAction(runCreateTermAction, {
      modules: { presenter },
      props: {
        termEndDate: '03/31/2050',
        termName: 'test term',
        termStartDate: '01/01/2050',
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      alertError: {
        message: errorMessage,
        title: 'Create term error.',
      },
    });
  });
});
