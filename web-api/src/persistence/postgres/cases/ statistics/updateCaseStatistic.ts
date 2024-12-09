import { Statistic } from '@shared/business/entities/Statistic';
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
        irsDeficiencyAmount: parseFloat(statistic.irsDeficiencyAmount),
        irsTotalPenalties: parseFloat(statistic.irsTotalPenalties),
        year: parseInt(statistic.year),
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
          penaltyAmount: parseFloat(p.penaltyAmount),
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
      ),
  );

  return new Statistic(updatedStatistic);
};
