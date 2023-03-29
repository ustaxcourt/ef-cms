import { isEmpty, orderBy, uniq } from 'lodash';
import { state } from 'cerebral';

export const opinionPamphletsHelper = (get, applicationContext) => {
  const opinionPamphlets = get(state.opinionPamphlets);

  const pamphletsByDate = {};

  opinionPamphlets.forEach(pamphlet => {
    pamphlet.formattedFilingDate = applicationContext
      .getUtilities()
      .formatDateString(pamphlet.filingDate, 'YYYYMMDD');

    pamphlet.filingDate = applicationContext
      .getUtilities()
      .formatDateString(pamphlet.filingDate, 'MMDDYY');

    if (isEmpty(pamphletsByDate[pamphlet.formattedFilingDate])) {
      pamphletsByDate[pamphlet.formattedFilingDate] = [pamphlet];
    } else {
      pamphletsByDate[pamphlet.formattedFilingDate].push(pamphlet);
    }
  });

  const filedPamphletDatesSorted = orderBy(
    Object.keys(pamphletsByDate),
    ['filingDate'],
    ['desc'],
  );

  const pamphletPeriods = uniq(
    filedPamphletDatesSorted.map(filingDate => {
      const b = applicationContext.getUtilities().deconstructDate(filingDate);
      return b.year;
    }),
  );

  const showPamphletsForYear = ({ filingDateKey, year }) => {
    if (filingDateKey.split('-')[0] === year) {
      return true;
    }
  };

  const filingDateKeys = Object.keys(pamphletsByDate);

  const pamhpletToDisplay = filingDateKey => {
    return pamphletsByDate[filingDateKey][0];
  };

  return {
    filingDateKeys,
    pamhpletToDisplay,
    pamphletPeriods,
    pamphletsByDate,
    showPamphletsForYear,
  };
};
