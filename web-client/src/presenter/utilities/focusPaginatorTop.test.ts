import { focusPaginatorTop } from './focusPaginatorTop';

describe('focusPaginatorTop', () => {
  it('should call window.scroll', () => {
    const scrollSpy = jest.fn();
    window.scrollTo = scrollSpy;

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
});
