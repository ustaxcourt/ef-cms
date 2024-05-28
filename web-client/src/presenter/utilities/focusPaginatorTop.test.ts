import { focusPaginatorTop } from './focusPaginatorTop';

describe('focusPaginatorTop', () => {
  const scrollSpy = jest.fn();
  window.scrollTo = scrollSpy;
  it('should call window.scroll if ref.current', () => {
    const mockRef = {
      current: {
        getBoundingClientRect: () => {
          return { top: 0 };
        },
      },
    };

    focusPaginatorTop(mockRef as any);
    expect(scrollSpy).toHaveBeenCalledTimes(1);
  });

  it('should return early if not ref.current', () => {
    const mockRef = {};

    focusPaginatorTop(mockRef as any);
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
