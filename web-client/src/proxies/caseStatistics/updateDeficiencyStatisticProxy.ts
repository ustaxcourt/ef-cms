import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateDeficiencyStatisticInteractor = (
  applicationContext: ClientApplicationContext,
  {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    docketNumber,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
    statisticId,
    year,
    yearOrPeriod,
  },
) => {
  return put({
    applicationContext,
    body: {
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
      penalties,
      year,
      yearOrPeriod,
    },
    endpoint: `/case-meta/${docketNumber}/statistics/${statisticId}`,
  });
};
