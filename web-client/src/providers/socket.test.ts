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
  let oncloseFn;
  let onopenFn;

  const mockSequence = jest.fn();

  beforeEach(() => {
    webSocketStub = jest.fn();
    webSocketCloseStub = jest.fn();

    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
    // Prevent logs from printing during unit tests
    jest.spyOn(console, 'log').mockImplementation(() => null);

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

      set onclose(value) {
        oncloseFn = value;
      }
    };

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

  it('should start and stops the socket', () => {
    startSocket();
    stopSocket();

    expect(webSocketStub).toHaveBeenCalled();
    expect(webSocketCloseStub).toHaveBeenCalled();
    expect(global.clearInterval).toHaveBeenCalled();
  });

  it('should return the original socket rather than a second one when start is called twice', () => {
    startSocket();
    startSocket();

    expect(webSocketStub).toHaveBeenCalledTimes(1);
    expect(webSocketCloseStub).not.toHaveBeenCalled();
  });

  it('should create an interval which sends a ping message to backend when start is called', () => {
    startSocket();

    onopenFn();

    expect(global.setInterval).toHaveBeenCalled();
  });

  it('should reconnect the websocket connection when it was disconnected with a non-normal error message', () => {
    startSocket();

    oncloseFn({ code: 2000 }); // Anything other than code 1000 will cause the socket to retry connection

    expect(console.log).toHaveBeenCalled();
    expect(webSocketStub).toHaveBeenCalledTimes(2);
  });

  it('should NOT reconnect the websocket when it was closed via a normal event', () => {
    startSocket();

    oncloseFn({ code: 1000 }); // Normal connection closure code

    expect(webSocketStub).toHaveBeenCalledTimes(1);
  });
});
