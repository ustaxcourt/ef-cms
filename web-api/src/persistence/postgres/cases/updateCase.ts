import { Case } from '@web-api/persistence/repository/Case';
import { getDataSource } from '@web-api/data-source';

export async function updateCase(caseToUpdate: Case) {
  const dataSource = await getDataSource();
  const caseRepository = dataSource.getRepository(Case);
  await caseRepository.save(caseToUpdate);
}
