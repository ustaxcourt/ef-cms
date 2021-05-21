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

    ({
      initialize: initializeSocket,
      start: startSocket,
      stop: stopSocket,
    } = socketProvider({
      socketRouter,
    }));

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

  it('calling start twice returns the original socket rather than a second one', () => {
    startSocket();
    startSocket();

    expect(webSocketStub).toBeCalledTimes(1);
    expect(webSocketCloseStub).not.toHaveBeenCalled();
  });
});
