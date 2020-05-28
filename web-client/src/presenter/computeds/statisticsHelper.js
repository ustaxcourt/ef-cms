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
export const statisticsHelper = (get, applicationContext) => {
  const { caseType, damages, litigationCosts, statistics } = get(
    state.caseDetail,
  );
  const permissions = get(state.permissions);
  const { CASE_TYPES_MAP } = applicationContext.getConstants();

  let formattedStatistics;

  if (statistics && statistics.length > 0) {
    formattedStatistics = statistics.map(statistic =>
      formatStatistic({ applicationContext, statistic }),
    );
  }

  const formattedDamages =
    damages && applicationContext.getUtilities().formatDollars(damages);
  const formattedLitigationCosts =
    litigationCosts &&
    applicationContext.getUtilities().formatDollars(litigationCosts);

  const showDamages = !!formattedDamages;
  const showLitigationCosts = !!formattedLitigationCosts;
  const showOtherStatistics = showDamages || showLitigationCosts;

  const showAddDeficiencyStatisticsButton =
    permissions.ADD_EDIT_STATISTICS && caseType === CASE_TYPES_MAP.deficiency;
  const showAddOtherStatisticsButton =
    permissions.ADD_EDIT_STATISTICS && !showOtherStatistics;

  return {
    formattedDamages,
    formattedLitigationCosts,
    formattedStatistics,
    showAddButtons:
      showAddDeficiencyStatisticsButton || showAddOtherStatisticsButton,
    showAddDeficiencyStatisticsButton,
    showAddOtherStatisticsButton,
    showDamages,
    showEditButtons: permissions.ADD_EDIT_STATISTICS,
    showLitigationCosts,
    showNoStatistics: !formattedStatistics && !showOtherStatistics,
    showOtherStatistics,
  };
};
