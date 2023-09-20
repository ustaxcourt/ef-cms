export const focusPaginatorTop = (ref: React.MutableRefObject<null>) => {
  window.scrollTo({
    behavior: 'smooth',
    left: 0,
    top:
      ref.current.getBoundingClientRect().top +
      window.document.documentElement.scrollTop -
      24,
  });
};
