import { withAppContextDecorator } from './withAppContext';

const myFunc = jest.fn();
const mockGet = jest.fn();
const mockAppContext = {};

describe('withAppContextDecorator', () => {
  it('decorates functions with the default application context', async () => {
    const decoratedResultFunc = withAppContextDecorator(myFunc);
    expect(decoratedResultFunc).toBeInstanceOf(Function);
    await decoratedResultFunc(mockGet);
    expect(myFunc).toHaveBeenCalledWith(mockGet, expect.anything());
  });

  it('decorates functions with the provided application context', async () => {
    const decoratedResultFunc = withAppContextDecorator(myFunc, mockAppContext);
    expect(decoratedResultFunc).toBeInstanceOf(Function);
    await decoratedResultFunc(mockGet);
    expect(myFunc).toHaveBeenCalledWith(mockGet, mockAppContext);
  });

  it('decorated function throws errors when NOT using USTC_DEBUG environment flag', () => {
    const throwsFunc = jest.fn(getFn => {
      if (getFn) {
        throw new Error('decorated function threw an error');
      }
    });
    const decoratedResultFunc = withAppContextDecorator(
      throwsFunc,
      mockAppContext,
    );
    let error;
    expect(decoratedResultFunc).toBeInstanceOf(Function);
    try {
      expect(decoratedResultFunc(mockGet)).toThrow(
        'decorated function threw an error',
      );
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(throwsFunc).toHaveBeenCalledWith(mockGet, mockAppContext);
  });

  it('decorated function will not re-throw error even if invocation throws errors when using USTC_DEBUG environment flag', () => {
    process.env.USTC_DEBUG = 'true';
    const throwsFunc = jest.fn(getFn => {
      if (getFn) {
        throw new Error('decorated function threw an error');
      }
    });
    const decoratedResultFunc = withAppContextDecorator(
      throwsFunc,
      mockAppContext,
    );
    expect(decoratedResultFunc).toBeInstanceOf(Function);
    const result = expect(decoratedResultFunc(mockGet)).toBe(null);
    expect(result).toBeFalsy();
  });
});
