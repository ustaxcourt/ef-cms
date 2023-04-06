import { cloneDeep, isEmpty, orderBy, uniq } from 'lodash';
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

const formatPamphletsForDisplay = (pamphlet, applicationContext) => {
  pamphlet.filingDateWithFullYear = applicationContext
    .getUtilities()
    .formatDateString(pamphlet.filingDate, 'YYYYMMDD');

  pamphlet.formattedFilingDate = applicationContext
    .getUtilities()
    .formatDateString(pamphlet.filingDate, 'MMDDYY');

  delete pamphlet.filingDate;

  let petitionerWordMatch =
    /,?\s*Petitioner\(s\)?|,\s*Petitioners?|,\s*Petitioner\b/gi;

  pamphlet.caseCaption = pamphlet.caseCaption.replace(petitionerWordMatch, '');
};

const groupPamphletsByFilingDate = ({
  applicationContext,
  opinionPamphlets,
}) => {
  let pamphletGroups = {};
  opinionPamphlets.forEach(pamphlet => {
    formatPamphletsForDisplay(pamphlet, applicationContext);

    if (isEmpty(pamphletGroups[pamphlet.filingDateWithFullYear])) {
      pamphletGroups[pamphlet.filingDateWithFullYear] = [pamphlet];
    } else {
      pamphletGroups[pamphlet.filingDateWithFullYear].push(pamphlet);
    }
  });
  return pamphletGroups;
};

export const opinionPamphletsHelper = (get, applicationContext) => {
  const opinionPamphlets: any = cloneDeep(get(state.opinionPamphlets));

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

  const getPamphletToDisplay = (filingDateKey: string): any => {
    return pamphletsGroupedByFilingDate[filingDateKey][0];
  };

  sortCasesByCaseCaption(pamphletsGroupedByFilingDate);

  return {
    getPamphletToDisplay,
    pamphletPeriods,
    pamphletsGroupedByFilingDate,
    yearAndFilingDateMap,
  };
};
