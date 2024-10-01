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

  it('should fail when attempting to clone something other than a file', async () => {
    let error;
    try {
      // @ts-ignore
      const clonePromise = cloneFile(2);
      keys.error();
      await clonePromise;
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
