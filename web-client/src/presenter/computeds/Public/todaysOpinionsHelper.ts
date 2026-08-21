import { state } from '@web-client/presenter/app-public.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { DESCENDING } from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import {
  SUPPORTED_SORT_FIELDS_FOR_TODAYS_OPINIONS,
  sortOptions,
} from '@web-client/views/Public/TodaysOpinionsConstants';

export const todaysOpinionsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const todaysOpinions = get(state.todaysOpinions);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MONTH_DAY_YEAR');

  const formattedOpinions = todaysOpinions.map(opinion => ({
    ...opinion,
    formattedFilingDate: applicationContext
      .getUtilities()
      .formatDateString(opinion.filingDate, 'MMDDYY'),
    formattedJudgeName: applicationContext
      .getUtilities()
      .getJudgeLastName(opinion.judge || opinion.signedJudgeName),
    numberOfPagesFormatted: opinion.numberOfPages ?? 'n/a',
  }));

  const tableSort = get(state.todaysOpinionsTableSort);

  const sortedFormattedOpinions = formattedOpinions.sort(
    (opinionA, opinionB) => {
      if (!tableSort) return 0;

      let sortNumber = 0;

      const compare1 = tableSort.sortOrder === DESCENDING ? opinionB : opinionA;
      const compare2 = tableSort.sortOrder === DESCENDING ? opinionA : opinionB;

      if (tableSort.sortField === 'docketNumber') {
        sortNumber = Case.docketNumberSort(
          compare1.docketNumber,
          compare2.docketNumber,
        );
      } else if (tableSort.sortField === 'numberOfPages') {
        const pages1 = Number(compare1.numberOfPages) || 0;
        const pages2 = Number(compare2.numberOfPages) || 0;
        sortNumber = pages1 - pages2;
      } else if (
        SUPPORTED_SORT_FIELDS_FOR_TODAYS_OPINIONS.includes(tableSort.sortField)
      ) {
        const compare1SortField = compare1[tableSort.sortField] || '';
        const compare2SortField = compare2[tableSort.sortField] || '';

        sortNumber = compare1SortField
          .toString()
          .localeCompare(compare2SortField.toString());
      }

      return sortNumber;
    },
  );

  return {
    formattedCurrentDate,
    formattedOpinions: sortedFormattedOpinions,
    sortOptions,
  };
};
