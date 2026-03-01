import { Get } from 'cerebral';
import { withAppContextDecorator } from './withAppContext';

const myFunc = jest.fn();
const mockGet = jest.fn() as unknown as Get;
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
});
