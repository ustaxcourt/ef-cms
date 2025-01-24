import { Statistic } from '@shared/business/entities/Statistic';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';
import { flatten, isEmpty } from 'lodash';

// Prefer createCaseStatistic, deleteCaseStatistic, or updateCaseStatistic.
// This is here for backwards compatibility with our Dynamo persistence patterns. In an ideal world, it wouldn't exist.
export const upsertCaseStatistics = async ({
  docketNumber,
  statistics,
}: {
  docketNumber: string;
  statistics: Statistic[];
}) => {
  if (isEmpty(statistics)) {
    return;
  }

  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseStatistic')
      .values(
        statistics.map(s => ({
          docketNumber,
          statisticId: s.statisticId,
          determinationDeficiencyAmount:
            s.determinationDeficiencyAmount || null,
          determinationTotalPenalties: s.determinationTotalPenalties || null,
          irsDeficiencyAmount: s.irsDeficiencyAmount,
          irsTotalPenalties: s.irsTotalPenalties,
          lastDateOfPeriod: s.lastDateOfPeriod
            ? calculateDate({ dateString: s.lastDateOfPeriod })
            : null,
          year: s.year ? parseInt(s.year) : null,
          yearOrPeriod: s.yearOrPeriod,
        })),
      )
      .onConflict(oc =>
        oc.columns(['statisticId']).doUpdateSet(s => {
          return {
            determinationDeficiencyAmount: s.ref(
              'excluded.determinationDeficiencyAmount',
            ),
            docketNumber: s.ref('excluded.docketNumber'),
            determinationTotalPenalties: s.ref(
              'excluded.determinationTotalPenalties',
            ),
            irsDeficiencyAmount: s.ref('excluded.irsDeficiencyAmount'),
            irsTotalPenalties: s.ref('excluded.irsTotalPenalties'),
            lastDateOfPeriod: s.ref('excluded.lastDateOfPeriod'),
            year: s.ref('excluded.year'),
            yearOrPeriod: s.ref('excluded.yearOrPeriod'),
          };
        }),
      )
      .execute(),
  );

  // Upsert related penalties
  const penalties = flatten(statistics.map(s => s.penalties));
  if (isEmpty(penalties)) {
    return;
  }

  await getDbWriter(writer =>
    writer
      .insertInto('dwStatisticPenalty')
      .values(
        penalties.map(p => ({
          name: p.name,
          penaltyAmount: p.penaltyAmount,
          penaltyId: p.penaltyId,
          penaltyType: p.penaltyType,
          statisticId: p.statisticId,
        })),
      )
      .onConflict(oc =>
        oc.column('penaltyId').doUpdateSet(p => {
          return {
            name: p.ref('excluded.name'),
            penaltyAmount: p.ref('excluded.penaltyAmount'),
            penaltyType: p.ref('excluded.penaltyType'),
          };
        }),
      )
      .execute(),
  );
};
