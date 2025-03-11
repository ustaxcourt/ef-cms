import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createCaseTrialSortMappingRecords } from '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords';
import { deleteCaseTrialSortMappingRecords } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';

export const updateCaseAutomaticBlock = async ({
  applicationContext,
  caseEntity,
  hasCaseDeadline,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  hasCaseDeadline?: boolean;
}) => {
  if (caseEntity.trialDate || caseEntity.highPriority) {
    return caseEntity;
  }

  if (hasCaseDeadline === undefined) {
    hasCaseDeadline = !isEmpty(
      await getCaseDeadlinesByDocketNumber({
        docketNumber: caseEntity.docketNumber,
      }),
    );
  }

  caseEntity.updateAutomaticBlocked({ hasCaseDeadline });

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
