import { JSDOM } from 'jsdom';
import { cloneFile } from './cloneFile';

describe('cloneFile', () => {
  const readAsArrayBufferSpy = jest.fn().mockResolvedValue();
  const keys = {};

  const addEventListenerSpy = jest.fn().mockImplementation((key, cb) => {
    keys[key] = cb;
  });

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>
<body>
  <input type="file" />
</body>`);

    const { window } = dom;
    const { File, FileReader } = window;

    global.File = File;
    global.FileReader = FileReader;
    jest.clearAllMocks();

    jest.spyOn(global, 'FileReader').mockImplementation(() => ({
      addEventListener: addEventListenerSpy,
      readAsArrayBuffer: readAsArrayBufferSpy,
    }));
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
