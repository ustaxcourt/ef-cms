import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { RawStatistic } from '@shared/business/entities/Statistic';

const isAmountEntered = (amount?: string | null): boolean =>
  amount !== undefined && amount !== null;

export const formatStatistic = ({
  applicationContext,
  docketNumber,
  statistic,
}: {
  applicationContext: ClientApplicationContext;
  docketNumber: string;
  statistic: RawStatistic;
}) => {
  const formattedDate =
    statistic.year ||
    applicationContext
      .getUtilities()
      .formatDateString(statistic.lastDateOfPeriod, 'MMDDYY');

  const formattedIrsDeficiencyAmount = applicationContext
    .getUtilities()
    .formatDollars(Number(statistic.irsDeficiencyAmount));

  const formattedIrsTotalPenalties = applicationContext
    .getUtilities()
    .formatDollars(Number(statistic.irsTotalPenalties));

  const formattedIrsTotal = applicationContext
    .getUtilities()
    .formatDollars(
      Number(statistic.irsDeficiencyAmount) +
        Number(statistic.irsTotalPenalties),
    );

  const hasDeterminationDeficiencyAmount = isAmountEntered(
    statistic.determinationDeficiencyAmount,
  );

  const hasDeterminationTotalPenalties = isAmountEntered(
    statistic.determinationTotalPenalties,
  );

  const formattedDeterminationDeficiencyAmount =
    hasDeterminationDeficiencyAmount
      ? applicationContext
          .getUtilities()
          .formatDollars(Number(statistic.determinationDeficiencyAmount))
      : 'TBD';

  const formattedDeterminationTotalPenalties = hasDeterminationTotalPenalties
    ? applicationContext
        .getUtilities()
        .formatDollars(Number(statistic.determinationTotalPenalties))
    : 'TBD';

  const hasDeterminationAmounts =
    hasDeterminationDeficiencyAmount && hasDeterminationTotalPenalties;

  const formattedDeterminationTotal = hasDeterminationAmounts
    ? applicationContext
        .getUtilities()
        .formatDollars(
          Number(statistic.determinationDeficiencyAmount) +
            Number(statistic.determinationTotalPenalties),
        )
    : 'TBD';

  const editStatisticLink = `/case-detail/${docketNumber}/edit-deficiency-statistic/${statistic.statisticId}`;

  return {
    ...statistic,
    editStatisticLink,
    formattedDate,
    formattedDeterminationDeficiencyAmount,
    formattedDeterminationTotalPenalties,
    formattedDeterminationTotal,
    formattedIrsDeficiencyAmount,
    formattedIrsTotalPenalties,
    formattedIrsTotal,
  };
};

/**
 * gets the formatted statistics
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} formatted statistics
 */
export const statisticsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { caseType, damages, docketNumber, litigationCosts, statistics } = get(
    state.caseDetail,
  );
  const permissions = get(state.permissions);
  const { CASE_TYPES_MAP } = applicationContext.getConstants();

  let formattedStatistics;

  const formatStatisticDateForSort = statistic => {
    let date;
    if (statistic.yearOrPeriod === 'Year') {
      date = `${statistic.year}-12-31`;
    } else {
      date = applicationContext
        .getUtilities()
        .formatDateString(statistic.lastDateOfPeriod);
    }
    return date;
  };

  if (statistics && statistics.length > 0) {
    formattedStatistics = statistics
      .map(statistic =>
        formatStatistic({ applicationContext, docketNumber, statistic }),
      )
      .sort((a, b) =>
        applicationContext
          .getUtilities()
          .dateStringsCompared(
            formatStatisticDateForSort(a),
            formatStatisticDateForSort(b),
          ),
      );
  }

  const formattedDamages =
    damages && applicationContext.getUtilities().formatDollars(+damages);
  const formattedLitigationCosts =
    litigationCosts &&
    applicationContext.getUtilities().formatDollars(+litigationCosts);

  const showDamages = !!formattedDamages;
  const showLitigationCosts = !!formattedLitigationCosts;
  const showOtherStatistics = showDamages || showLitigationCosts;

  const hasMaxDeficiencyStatistics = statistics && statistics.length === 12;

  const showAddDeficiencyStatisticsButton =
    permissions.ADD_EDIT_STATISTICS &&
    caseType === CASE_TYPES_MAP.deficiency &&
    !hasMaxDeficiencyStatistics;

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
