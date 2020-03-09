import { cloneFile } from './cloneFile';

describe('cloneFile', () => {
  let readAsArrayBufferSpy;
  let addEventListenerSpy;

  beforeEach(() => {
    readAsArrayBufferSpy = jest.spyOn(
      FileReader.prototype,
      'readAsArrayBuffer',
    );
    addEventListenerSpy = jest.spyOn(FileReader.prototype, 'addEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully clone a file', async () => {
    const clonedFile = await cloneFile(new File([], 'tmp.pdf'));

    expect(clonedFile).toBeDefined();
    expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(addEventListenerSpy.mock.calls[0][0]).toEqual('load');
    expect(addEventListenerSpy.mock.calls[1][0]).toEqual('error');
  });

  it('should fail when attempting to clone something other than a file', async () => {
    let err;
    let clonedFile;

    try {
      clonedFile = await cloneFile(2);
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(clonedFile).toBeUndefined();
    expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(0);
  });
});
