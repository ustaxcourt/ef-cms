import { cloneFile } from './cloneFile';

describe('cloneFile', () => {
  const readAsArrayBufferSpy = jest.fn().mockResolvedValue();
  const keys = {};

  const addEventListenerSpy = jest.fn().mockImplementation((key, cb) => {
    keys[key] = cb;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    global.File = function () {};

    jest.spyOn(global, 'FileReader').mockImplementation(() => ({
      addEventListener: addEventListenerSpy,
      readAsArrayBuffer: readAsArrayBufferSpy,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fail when attempting to clone something other than a file', async () => {
    let error;
    try {
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
