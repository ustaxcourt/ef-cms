import { Statistic } from '@shared/business/entities/Statistic';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const updateCaseStatistic = async ({
  statistic,
}: {
  statistic: Statistic;
}): Promise<Statistic> => {
  const updatedStatistic = await getDbWriter(writer =>
    writer
      .updateTable('dwCaseStatistic')
      .set({
        determinationDeficiencyAmount:
          statistic.determinationDeficiencyAmount || null,
        determinationTotalPenalties:
          statistic.determinationTotalPenalties || null,
        irsDeficiencyAmount: statistic.irsDeficiencyAmount,
        irsTotalPenalties: statistic.irsTotalPenalties,
        lastDateOfPeriod: statistic.lastDateOfPeriod
          ? calculateDate({ dateString: statistic.lastDateOfPeriod })
          : null,
        year: statistic.year ? parseInt(statistic.year) : null,
        yearOrPeriod: statistic.yearOrPeriod,
      })
      .where('statisticId', '=', statistic.statisticId)
      .returningAll()
      .executeTakeFirst(),
  );

  // Upsert related penalties
  await getDbWriter(writer =>
    writer
      .insertInto('dwStatisticPenalty')
      .values(
        statistic.penalties.map(p => ({
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

  return new Statistic(updatedStatistic);
};
