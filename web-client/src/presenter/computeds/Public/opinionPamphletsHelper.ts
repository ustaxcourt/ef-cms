import { isEmpty, uniq } from 'lodash';
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
  const yearAndFilingDateMap = {};

  const pamphletsByDate = groupPamphletsByFilingDate({
    applicationContext,
    opinionPamphlets,
  });

  const uniqueFilingDates = Object.keys(pamphletsByDate);

  const pamphletPeriods: string[] = uniq(
    uniqueFilingDates.map(filingDate => {
      const b = applicationContext.getUtilities().deconstructDate(filingDate);
      return b?.year;
    }),
  );

  uniqueFilingDates.forEach(filingDate => {
    pamphletPeriods.forEach(year => {
      if (filingDate.split('-')[0] === year) {
        if (isEmpty(yearAndFilingDateMap[year])) {
          yearAndFilingDateMap[year] = [filingDate];
        } else {
          yearAndFilingDateMap[year].push(filingDate);
        }
      }
    });
  });

  const getPamhpletToDisplay = (filingDateKey: string): any => {
    return pamphletsByDate[filingDateKey][0];
  };

  return {
    getPamhpletToDisplay,
    pamphletsByDate,
    yearAndFilingDateMap,
  };
};
