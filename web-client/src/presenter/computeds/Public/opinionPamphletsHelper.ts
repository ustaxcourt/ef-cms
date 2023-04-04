import { isEmpty, orderBy, uniq } from 'lodash';
import { state } from 'cerebral';

const sortCasesByCaseCaption = pamphletsGroupedByFilingDate => {
  Object.keys(pamphletsGroupedByFilingDate).forEach(filingDateKey => {
    pamphletsGroupedByFilingDate[filingDateKey] = orderBy(
      pamphletsGroupedByFilingDate[filingDateKey],
      'caseCaption',
      'asc',
    );
  });
};

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

  const pamphletsGroupedByFilingDate = groupPamphletsByFilingDate({
    applicationContext,
    opinionPamphlets,
  });

  const uniqueFilingDates = Object.keys(pamphletsGroupedByFilingDate);

  const pamphletPeriods: any[] = uniq(
    uniqueFilingDates.map(filingDate => {
      const b = applicationContext.getUtilities().deconstructDate(filingDate);
      return b?.year;
    }),
  );

  pamphletPeriods.sort((a, b) => b - a);

  let yearAndFilingDateMap = {};

  pamphletPeriods.forEach(year => {
    uniqueFilingDates.forEach(filingDate => {
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

  sortCasesByCaseCaption(pamphletsGroupedByFilingDate);

  return {
    getPamhpletToDisplay,
    pamphletPeriods,
    pamphletsGroupedByFilingDate,
    yearAndFilingDateMap,
  };
};
