import { isEmpty, orderBy, uniq } from 'lodash';
import { state } from 'cerebral';

const groupPamphletsByFilingDate = ({
  applicationContext,
  opinionPamphlets,
}) => {
  let pamphletGroups = {};
  opinionPamphlets.forEach(pamphlet => {
    pamphlet.formattedFilingDate = applicationContext
      .getUtilities()
      .formatDateString(pamphlet.filingDate, 'YYYYMMDD');

    pamphlet.filingDate = applicationContext
      .getUtilities()
      .formatDateString(pamphlet.filingDate, 'MMDDYY');

    if (isEmpty(pamphletGroups[pamphlet.formattedFilingDate])) {
      pamphletGroups[pamphlet.formattedFilingDate] = [pamphlet];
    } else {
      pamphletGroups[pamphlet.formattedFilingDate].push(pamphlet);
    }
  });
  return pamphletGroups;
};

export const opinionPamphletsHelper = (get, applicationContext) => {
  const opinionPamphlets: any = get(state.opinionPamphlets);

  const pamphletsByDate = groupPamphletsByFilingDate({
    applicationContext,
    opinionPamphlets,
  });

  //list of filing dates sorted desc
  const filedPamphletDatesSorted: string[] = orderBy(
    Object.keys(pamphletsByDate),
    ['filingDate'],
    ['desc'],
  );

  //list of unique years
  const pamphletPeriods: string[] = uniq(
    filedPamphletDatesSorted.map(filingDate => {
      const b = applicationContext.getUtilities().deconstructDate(filingDate);
      return b?.year;
    }),
  );

  //maybe key value sitch where key is year and value is array of filing dates for that year
  const filingDateKeys = Object.keys(pamphletsByDate);

  const shouldShowPamphletsForYear = ({ filingDateKey, year }): Boolean => {
    return filingDateKey.split('-')[0] === year;
  };

  const getPamhpletToDisplay = (filingDateKey: string): any => {
    return pamphletsByDate[filingDateKey][0];
  };

  return {
    filingDateKeys,
    getPamhpletToDisplay,
    pamphletPeriods,
    pamphletsByDate,
    shouldShowPamphletsForYear,
  };
};
