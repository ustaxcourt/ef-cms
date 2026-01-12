import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const getExportTypeAction = ({ get, path }: ActionProps) => {
  const exportType = get(state.trialLocationPage.currentTab);
  const exportFileString =
    exportType === 'eligibleCases' ? 'Eligible Cases' : 'Blocked Cases Report';

  const [city, usState] = get(state.trialLocationPage.location).split(',');
  const date = formatNow(FORMATS.YEAR);

  const fileName = `${exportFileString} - ${city.trim()}_${usState.trim()}_${date}`;

  if (exportType === 'eligibleCases') {
    return path.eligibleCases({ fileName });
  } else {
    return path.blockedCases({ fileName });
  }
};
