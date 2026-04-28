
export const getCurrentVersionInteractor = applicationContext => {
  return applicationContext
    .getHttpClient()
    .get('/deployed-date.txt')
    .then(response => {
      return response.data;
    });
};
