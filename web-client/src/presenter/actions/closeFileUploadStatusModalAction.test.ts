import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { closeFileUploadStatusModalAction } from './closeFileUploadStatusModalAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('closeFileUploadStatusModalAction', () => {
  beforeEach(() => {
    applicationContext.getUtilities().sleep = jest.fn();
    presenter.providers.applicationContext = applicationContext;
  });

  it('should reset file upload state values', async () => {
    process.env.FILE_UPLOAD_MODAL_TIMEOUT = '77';
    const result = await runAction(closeFileUploadStatusModalAction, {
      modules: {
        presenter,
      },
      state: { modal: { showModal: 'FileUploadStatusModal' } },
    });

    const sleepCalls = (applicationContext.getUtilities().sleep as jest.Mock)
      .mock.calls;

    expect(sleepCalls.length).toBe(1);
    expect(sleepCalls[0][0]).toBe(77);
    expect(result.state).toMatchObject({
      fileUploadProgress: {
        isUploading: false,
        percentComplete: 100,
        timeRemaining: 0,
      },
      modal: {
        showModal: '',
      },
    });
  });

  it('should not reset file upload state values when a different modal is displayed', async () => {
    process.env.FILE_UPLOAD_MODAL_TIMEOUT = '77';

    const result = await runAction(closeFileUploadStatusModalAction, {
      modules: {
        presenter,
      },
      state: { modal: { showModal: 'TEST_MODAL' } },
    });
    expect(result.state.modal.showModal).toEqual('TEST_MODAL');
  });

  it('uses a default timeout value if not provided', async () => {
    delete process.env.FILE_UPLOAD_MODAL_TIMEOUT;
    await runAction(closeFileUploadStatusModalAction, {
      modules: {
        presenter,
      },
    });

    const sleepCalls = (applicationContext.getUtilities().sleep as jest.Mock)
      .mock.calls;
    expect(sleepCalls.length).toBe(1);
    expect(sleepCalls[0][0]).toBe(3000);
  });
});
