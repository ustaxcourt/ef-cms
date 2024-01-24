export const logClientErrorInteractor = (
  applicationContext: IApplicationContext,
  {
    error,
    method,
    status,
    url,
  }: {
    error: string;
    url: any;
    status: any;
    method: any;
  },
) => {
  applicationContext.logger.error(error, {
    error,
    method,
    status,
    url,
  });
  return { status: 'success' };
};
