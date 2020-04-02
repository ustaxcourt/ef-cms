import { cloneFile } from './cloneFile';

describe('cloneFile', () => {
  const readAsArrayBufferSpy = jest.fn().mockResolvedValue();
  const keys = {};

  const addEventListenerSpy = jest.fn().mockImplementation((key, cb) => {
    keys[key] = cb;
  });

  beforeEach(() => {
    const FileReader = jest.spyOn(global, 'FileReader');
    FileReader.mockImplementation(() => ({
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
