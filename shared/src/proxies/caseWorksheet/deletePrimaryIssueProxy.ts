import { post } from '../requests';

export const deletePrimaryIssueInteractor = (
  applicationContext,
  {
    docketNumber,
  }: {
    docketNumber: string;
  },
) => {
  return post({
    applicationContext,
    body: {},
    endpoint: `/case-worksheet/${docketNumber}/primary-issue/delete`,
  });
};
