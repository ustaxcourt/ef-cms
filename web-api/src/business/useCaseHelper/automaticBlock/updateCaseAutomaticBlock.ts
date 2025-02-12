import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createCaseTrialSortMappingRecords } from '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords';
import { deleteCaseTrialSortMappingRecords } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';

/**
 * updateCaseAutomaticBlock
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity to update
 * @returns {object} the updated case entity
 */
export const updateCaseAutomaticBlock = async ({
  applicationContext,
  caseEntity,
  deadlines = undefined,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  deadlines?: CaseDeadline[];
}) => {
  if (caseEntity.trialDate || caseEntity.highPriority) {
    return caseEntity;
  }
  const caseDeadlines =
    deadlines ||
    (await getCaseDeadlinesByDocketNumber({
      docketNumber: caseEntity.docketNumber,
    }));

  caseEntity.updateAutomaticBlocked({ caseDeadlines });

  if (caseEntity.automaticBlocked) {
    await deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      deleteConsolidatedCases: true,
    });
  } else if (caseEntity.isReadyForTrial()) {
    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: caseEntity.generateTrialSortTags(),
      docketNumber: caseEntity.docketNumber,
    });
  }

  return caseEntity;
};
