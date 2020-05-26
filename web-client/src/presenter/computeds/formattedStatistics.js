import { state } from 'cerebral';

export const formatStatistic = ({ applicationContext, statistic }) => {
  const formattedDate =
    statistic.year ||
    applicationContext
      .getUtilities()
      .formatDateString(statistic.lastDateOfPeriod, 'MMDDYY');

  const formattedIrsDeficiencyAmount = applicationContext
    .getUtilities()
    .formatDollars(statistic.irsDeficiencyAmount);

  const formattedIrsTotalPenalties = applicationContext
    .getUtilities()
    .formatDollars(statistic.irsTotalPenalties);

  const formattedDeterminationDeficiencyAmount = statistic.determinationDeficiencyAmount
    ? applicationContext
        .getUtilities()
        .formatDollars(statistic.determinationDeficiencyAmount)
    : 'TBD';

  const formattedDeterminationTotalPenalties = statistic.determinationTotalPenalties
    ? applicationContext
        .getUtilities()
        .formatDollars(statistic.determinationTotalPenalties)
    : 'TBD';

  return {
    ...statistic,
    formattedDate,
    formattedDeterminationDeficiencyAmount,
    formattedDeterminationTotalPenalties,
    formattedIrsDeficiencyAmount,
    formattedIrsTotalPenalties,
  };
};

/**
 * gets the formatted statistics
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} formatted statistics
 */
export const formattedStatistics = (get, applicationContext) => {
  const statitistics = get(state.caseDetail.statistics);

  if (statitistics && statitistics.length > 0) {
    const formattedStatistics = statitistics.map(statistic =>
      formatStatistic({ applicationContext, statistic }),
    );

    return formattedStatistics;
  }
};
