export const focusPaginatorTop = (ref: React.RefObject<HTMLDivElement>) => {
  if (!ref.current) {
    return;
  }

  window.scrollTo({
    behavior: 'smooth',
    left: 0,
    top:
      ref.current.getBoundingClientRect().top +
      window.document.documentElement.scrollTop -
      24,
  });
};
