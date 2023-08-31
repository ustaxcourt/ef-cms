import { get } from '../requests';

export const getCaseWorksheetInfoInteractor = (
  applicationContext,
  { judge },
) => {
  return get({
    applicationContext,
    endpoint: `/case-worksheet/${judge}`,
  });
};
