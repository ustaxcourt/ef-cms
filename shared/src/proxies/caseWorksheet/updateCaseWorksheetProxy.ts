import { post } from '../requests';

export const updateCaseWorksheetInteractor = (
  applicationContext,
  {
    docketNumber,
    updatedProps,
  }: {
    docketNumber: string;
    updatedProps: Record<string, string | undefined>;
  },
) => {
  return post({
    applicationContext,
    body: { docketNumber, updatedProps },
    endpoint: `/cases/${docketNumber}/case-worksheet`,
  });
};
