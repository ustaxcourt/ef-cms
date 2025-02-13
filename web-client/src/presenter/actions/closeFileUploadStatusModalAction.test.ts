import { closeFileUploadStatusModalAction } from './closeFileUploadStatusModalAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('closeFileUploadStatusModalAction', () => {
  beforeAll(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should reset file upload state values', async () => {
    process.env.FILE_UPLOAD_MODAL_TIMEOUT = '77';
    const result = await runAction(closeFileUploadStatusModalAction, {
      modules: {
        presenter,
      },
      state: { modal: { showModal: 'FileUploadStatusModal' } },
    });

    // inspecting arguments of 4th call because it seems `store.set` also invokes setTimeout
    expect(global.setTimeout.mock.calls[3][1]).toBe('77');
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

    // inspecting arguments of 4th call because it seems `store.set` also invokes setTimeout
    expect(global.setTimeout.mock.calls[3][1]).toEqual(3000);
  });
});
