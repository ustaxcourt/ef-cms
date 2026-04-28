import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const addDeficiencyStatisticInteractor = (
  applicationContext: ClientApplicationContext,
  {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    docketNumber,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
    year,
    yearOrPeriod,
  },
) => {
  return post({
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
    endpoint: `/case-meta/${docketNumber}/statistics`,
  });
};
