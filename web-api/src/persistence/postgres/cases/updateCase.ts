import { AppDataSource } from '@web-api/data-source';
import { Case } from '@web-api/persistence/repository/Case';

export async function updateCase(caseToUpdate: Case) {
  const caseRepository = AppDataSource.getRepository(Case);
  await caseRepository.save(caseToUpdate);
}
