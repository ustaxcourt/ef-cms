import { ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { fileUploadErrorAction } from './fileUploadErrorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('fileUploadErrorAction', () => {
  it('returns default values when no error information is provided', async () => {
    const { output } = await runAction(fileUploadErrorAction, {});

    expect(output).toEqual({
      contactSupportMessage:
        'If you still have a problem uploading the file, email',
      errorToLog: undefined,
      message: 'There is a problem with this file.',
      title: 'There is a problem with this file',
      troubleshootingInfo: undefined,
    });
  });

  it('uses provided display/log messages and troubleshooting link for non wrong-file-type errors', async () => {
    const { output } = await runAction(fileUploadErrorAction, {
      props: {
        errorInformation: {
          errorMessageToDisplay: 'Displayed message',
          errorMessageToLog: 'Logged message',
          errorType: ErrorTypes.FILE_TOO_BIG,
        },
      },
    });

    expect(output).toEqual({
      contactSupportMessage:
        'If you still have a problem uploading the file, email',
      errorToLog: 'Logged message',
      message: 'Displayed message',
      title: 'There is a problem with this file',
      troubleshootingInfo: {
        linkMessage: 'Learn about troubleshooting files',
        linkUrl: TROUBLESHOOTING_INFO.FILE_UPLOAD_TROUBLESHOOTING_LINK,
      },
    });
  });

  it('falls back to display message for logging and omits troubleshooting link for wrong-file-type errors', async () => {
    const { output } = await runAction(fileUploadErrorAction, {
      props: {
        errorInformation: {
          errorMessageToDisplay: 'Only display message',
          errorType: ErrorTypes.WRONG_FILE_TYPE,
        },
      },
    });

    expect(output).toEqual({
      contactSupportMessage:
        'If you still have a problem uploading the file, email',
      errorToLog: 'Only display message',
      message: 'Only display message',
      title: 'There is a problem with this file',
      troubleshootingInfo: undefined,
    });
  });
});
