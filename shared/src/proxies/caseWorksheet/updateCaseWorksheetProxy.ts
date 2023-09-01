import { post } from '../requests';

export const updateCaseWorksheetInteractor = (
  applicationContext,
  body: {
    docketNumber: string;
    updatedProps: { [key: string]: string };
  },
) => {
  return post({
    applicationContext,
    body,
    endpoint: `/cases/${body.docketNumber}/case-worksheet`,
  });
};
