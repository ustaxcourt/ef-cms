import { cloneFile } from './cloneFile';

describe('cloneFile', () => {
  const readAsArrayBufferSpy = jest.fn().mockResolvedValue(undefined);
  const keys: Record<string, Function> = {};

  const addEventListenerSpy = jest.fn().mockImplementation((key, cb) => {
    keys[key] = cb;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    global.File = function () {} as any;

    jest.spyOn(global, 'FileReader').mockImplementation(
      () =>
        ({
          addEventListener: addEventListenerSpy,
          readAsArrayBuffer: readAsArrayBufferSpy,
        }) as unknown as FileReader,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully clone a file', async () => {
    const clonePromise = cloneFile(new File([], 'tmp.pdf'));
    keys.load();
    const clonedFile = await clonePromise;

    expect(clonedFile).toBeDefined();
    expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(addEventListenerSpy.mock.calls[0][0]).toEqual('load');
    expect(addEventListenerSpy.mock.calls[1][0]).toEqual('error');
  });
});
