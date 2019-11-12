import { socketRouter } from './socketRouter';

const mockSequence = jest.fn();
const mockCallback = jest.fn();
const mockApp = {
  getSequence: () => {
    return mockSequence;
  },
  getState: () => {
    return 'mockToken';
  },
};

describe('socketRouter', () => {
  it('should call batchDownloadReadySequence and callback if present', () => {
    socketRouter(mockApp, mockCallback)({
      data: '{ "action": "batch_download_ready" }',
    });
    socketRouter(mockApp)({
      data: '{ "action": "batch_download_ready" }',
    });
    expect(mockSequence.mock.calls.length).toBe(2);
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
