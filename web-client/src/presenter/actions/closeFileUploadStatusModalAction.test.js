import { closeFileUploadStatusModalAction } from './closeFileUploadStatusModalAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('closeFileUploadStatusModalAction', () => {
  beforeAll(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should reset file upload state values', async () => {
    process.env.FILE_UPLOAD_MODAL_TIMEOUT = 77;
    const result = await runAction(closeFileUploadStatusModalAction, {
      modules: {
        presenter,
      },
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
});
