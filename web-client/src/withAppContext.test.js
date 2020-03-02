import { withAppContextDecorator } from './withAppContext';

const myFunc = jest.fn();
const mockGet = jest.fn();
const mockAppContext = {};

describe('withAppContextDecorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('decorated function throws errors when not using USTC_DEBUG environment flag', async () => {
    const throwsFunc = jest
      .fn()
      .mockRejectedValue(new Error('decorated function threw an error'));
    const decoratedResultFunc = withAppContextDecorator(
      throwsFunc,
      mockAppContext,
    );
    await expect(decoratedResultFunc).toBeInstanceOf(Function);
    await expect(decoratedResultFunc(mockGet)).rejects.toThrow(
      'decorated function threw an error',
    );
    expect(throwsFunc).toHaveBeenCalledWith(mockGet, mockAppContext);
  });

  it('decorated function will not re-throw error even if invocation throws errors when using USTC_DEBUG environment flag', async () => {
    process.env.USTC_DEBUG = 'true';
    const throwsFunc = jest
      .fn()
      .mockRejectedValue(new Error('decorated function threw an error'));
    const decoratedResultFunc = withAppContextDecorator(
      throwsFunc,
      mockAppContext,
    );
    expect(decoratedResultFunc).toBeInstanceOf(Function);
    const result = await expect(
      decoratedResultFunc(mockGet),
    ).resolves.not.toThrow();
    expect(result).toBeFalsy();
  });
});
