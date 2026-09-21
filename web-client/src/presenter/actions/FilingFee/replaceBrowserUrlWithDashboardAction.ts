export const replaceBrowserUrlWithDashboardAction = (): void => {
  window.history.replaceState({}, '', '/');
};
