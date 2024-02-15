import { delay } from '@web-client/utilities/delay';
import { socketProvider } from './socket';
import { socketRouter } from './socketRouter';
jest.mock('./socketRouter');
jest.mock('@web-client/utilities/delay', () => ({
  delay: jest.fn(),
}));

const mockedDelay = jest.mocked(delay);

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
    jest.clearAllMocks();

    webSocketStub = jest.fn();
    webSocketCloseStub = jest.fn();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
    // Prevent logs from printing during unit tests
    jest.spyOn(console, 'log').mockImplementation(() => null);
    mockedDelay.mockResolvedValue(undefined);
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

  it('should start and stop the socket', () => {
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

  it('should reconnect the websocket connection when it was disconnected with a non-normal error message', async () => {
    startSocket();
    oncloseFn({ code: 2000 }); // Anything other than code 1000 will cause the socket to retry connection
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockedDelay).toHaveBeenCalledTimes(1);
    expect(mockedDelay).toHaveBeenCalledWith(2000);

    expect(webSocketStub).toHaveBeenCalledTimes(2);
  });

  it('should exponentially back off reconnect attempts', async () => {
    startSocket();
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockedDelay).toHaveBeenCalledTimes(4);
    expect(mockedDelay).toHaveBeenCalledWith(2000);
    expect(mockedDelay).toHaveBeenCalledWith(4000);
    expect(mockedDelay).toHaveBeenCalledWith(8000);
    expect(mockedDelay).toHaveBeenCalledWith(16000);

    expect(webSocketStub).toHaveBeenCalledTimes(5);
  });

  it('should stop reconnecting after 4 attempts', async () => {
    startSocket();

    //attempt #1
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));
    //attempt #2
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));
    //attempt #3
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));
    //attempt #4
    // eslint-disable-next-line jest/valid-expect-in-promise
    oncloseFn({ code: 2000 }).catch(e => {
      expect(e).toBeUndefined();
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    //attempt #5
    oncloseFn({ code: 2000 });
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockedDelay).toHaveBeenCalledTimes(4);

    // 1 initial start + 4 reconnects
    expect(webSocketStub).toHaveBeenCalledTimes(5);
  });

  it('should NOT reconnect the websocket when it was closed via a normal event', () => {
    startSocket();

    oncloseFn({ code: 1000 }); // Normal connection closure code

    expect(webSocketStub).toHaveBeenCalledTimes(1);
  });
});
