import { isEmpty, orderBy, uniq } from 'lodash';
import { state } from 'cerebral';

// --pamphletsGroupedByFilingDate - each array -arrange cases by petr last name alphabetivsly
//sort years desc
//sort filing date keys desc
const sortCasesByPetitionerName = pamphletsGroupedByFilingDate => {
  Object.keys(pamphletsGroupedByFilingDate).forEach(filingDateKey => {
    pamphletsGroupedByFilingDate[filingDateKey].map(tcrp => {
      const firstPetitonerName = tcrp.caseCaption.split(',')[0].split(' ');
      tcrp.sortingName = firstPetitonerName[firstPetitonerName.length - 1];
    });

    pamphletsGroupedByFilingDate[filingDateKey] = orderBy(
      pamphletsGroupedByFilingDate[filingDateKey],
      'sortingName',
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

  sortCasesByPetitionerName(pamphletsGroupedByFilingDate);

  return {
    getPamhpletToDisplay,
    pamphletsGroupedByFilingDate,
    yearAndFilingDateMap,
  };
};
