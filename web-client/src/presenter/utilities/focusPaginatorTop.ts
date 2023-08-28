export const focusPaginatorTop = (ref: React.MutableRefObject<null>) => {
  window.scrollTo({
    behavior: 'smooth',
    left: 0,
    top: ref.current.offsetTop - 24,
  });
};
