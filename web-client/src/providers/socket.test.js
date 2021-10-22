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
  let onopenFn;

  beforeEach(() => {
    webSocketStub = jest.fn();
    webSocketCloseStub = jest.fn();

    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');

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

      set onopen(value) {
        onopenFn = value;
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
    expect(global.clearInterval).toHaveBeenCalled();
  });

  it('calling start twice returns the original socket rather than a second one', () => {
    startSocket();
    startSocket();

    expect(webSocketStub).toBeCalledTimes(1);
    expect(webSocketCloseStub).not.toHaveBeenCalled();
  });

  it('calling start should create an interval which sends a ping message to backend', () => {
    startSocket();
    onopenFn();
    expect(global.setInterval).toHaveBeenCalled();
  });
});
