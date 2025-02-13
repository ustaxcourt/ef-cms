import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { getCasesByEmailTotal as getCasesByEmailTotalElasticsearch } from '@web-api/persistence/elasticsearch/getCasesByEmailTotal';

export const getCasesByEmailTotal = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  if (role === ROLES.petitioner) {
    const total = await getDbReader(reader =>
      reader
        .selectFrom('dwPetitionerOnCase')
        .where('email', '=', email)
        .select(({ fn }) => fn.count('docketNumber').as('count'))
        .execute(),
    );
    return Number(total[0].count);
  }
  return await getCasesByEmailTotalElasticsearch({ applicationContext, email });
};
