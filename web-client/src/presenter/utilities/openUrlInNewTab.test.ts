import { openUrlInNewTab } from './openUrlInNewTab';

describe('openUrlInNewTab', () => {
  const mockUrl = 'www.example.com';

  const openSpy = jest.fn();
  window.open = openSpy;

  it('should call window.open after waiting for the timer to expire', () => {
    jest.useFakeTimers();

    openUrlInNewTab({ url: mockUrl });

    expect(openSpy).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(openSpy).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should open the specified url in a new tab', () => {
    jest.useFakeTimers();

    openUrlInNewTab({ url: mockUrl });

    jest.runAllTimers();

    expect(openSpy).toHaveBeenCalledWith(mockUrl, '_blank');

    jest.useRealTimers();
  });
});
