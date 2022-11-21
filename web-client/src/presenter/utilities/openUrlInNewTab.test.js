import { openUrlInNewTab } from './openUrlInNewTab';

describe('openUrlInNewTab', () => {
  const closeSpy = jest.fn();
  const writeSpy = jest.fn();

  beforeEach(() => {
    window.open = jest.fn().mockReturnValue({
      close: closeSpy,
      document: {
        write: writeSpy,
      },
      location: { href: '' },
    });
  });

  it('should open a new tab before fetching the url to open', async () => {
    try {
      await openUrlInNewTab(() => {
        throw new Error();
      });
    } catch (e) {
      expect(window.open).toHaveBeenCalled();
    }
  });

  it('should throw an error if url is invalid', async () => {
    await expect(
      openUrlInNewTab(() => {
        throw new Error();
      }),
    ).rejects.toThrow();
  });
});
