import { socketProvider } from './socket';
import { socketRouter } from './socketRouter';
jest.mock('./socketRouter');

describe('socket', () => {
  let mockApp;

  let webSocketStub;
  let webSocketCloseStub;

  let initializeSocket;
  let startSocket;
  let stopSocket;

  beforeEach(() => {
    webSocketStub = jest.fn();
    webSocketCloseStub = jest.fn();

    const { initialize, start, stop } = socketProvider({
      socketRouter,
    });

    initializeSocket = initialize;
    startSocket = start;
    stopSocket = stop;

    global.WebSocket = class {
      constructor() {
        webSocketStub();
      }

      close() {
        webSocketCloseStub();
      }
    };

    const mockSequence = jest.fn();
    mockApp = {
      getSequence: () => {
        return mockSequence;
      },
      getState: () => {
        return 'mockToken';
      },
    };

    initializeSocket(mockApp);
  });

  it('starts and stops the socket', () => {
    startSocket();
    stopSocket();

    expect(webSocketStub).toHaveBeenCalled();
    expect(webSocketCloseStub).toHaveBeenCalled();
  });
});
