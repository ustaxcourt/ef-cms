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

  it('should successfully clone a file', done => {
    cloneFile(new File([], 'tmp.pdf')).then(clonedFile => {
      expect(clonedFile).toBeDefined();
      expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(addEventListenerSpy.mock.calls[0][0]).toEqual('load');
      expect(addEventListenerSpy.mock.calls[1][0]).toEqual('error');
      done();
    });
    keys.load();
  });

  it('should fail when attempting to clone something other than a file', done => {
    cloneFile(2).catch(() => {
      expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      done();
    });
    keys.error();
  });
});
