const pageTitleSuffix = ' | U.S. Tax Court';

export const setPageTitle = title => {
  document.title = `${title} ${pageTitleSuffix}`;
};
