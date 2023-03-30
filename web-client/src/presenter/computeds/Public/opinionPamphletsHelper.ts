import { isEmpty, uniq } from 'lodash';
import { state } from 'cerebral';

const groupPamphletsByFilingDate = ({
  applicationContext,
  opinionPamphlets,
}) => {
  let pamphletGroups = {};
  opinionPamphlets.forEach(pamphlet => {
    pamphlet.filingDateWithFullYear = applicationContext
      .getUtilities()
      .formatDateString(pamphlet.filingDate, 'YYYYMMDD');

    pamphlet.formattedFilingDate = applicationContext
      .getUtilities()
      .formatDateString(pamphlet.filingDate, 'MMDDYY');

    delete pamphlet.filingDate;

    if (isEmpty(pamphletGroups[pamphlet.filingDateWithFullYear])) {
      pamphletGroups[pamphlet.filingDateWithFullYear] = [pamphlet];
    } else {
      pamphletGroups[pamphlet.filingDateWithFullYear].push(pamphlet);
    }
  });
  return pamphletGroups;
};

export const opinionPamphletsHelper = (get, applicationContext) => {
  const opinionPamphlets: any = get(state.opinionPamphlets);
  const yearAndFilingDateMap = {};

  const pamphletsGroupedByFilingDate = groupPamphletsByFilingDate({
    applicationContext,
    opinionPamphlets,
  });

  const uniqueFilingDates = Object.keys(pamphletsGroupedByFilingDate);

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
    return pamphletsGroupedByFilingDate[filingDateKey][0];
  };

  return {
    getPamhpletToDisplay,
    pamphletsGroupedByFilingDate,
    yearAndFilingDateMap,
  };
};
