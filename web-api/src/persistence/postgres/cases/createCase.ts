import { Case } from '@shared/business/entities/cases/Case';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { fieldsToOmitBeforePersisting } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';
import { omit } from 'lodash';

export const createCase = async ({ caseToCreate }: { caseToCreate: Case }) => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwCase')
      .values({
        ...omit(caseToCreate, fieldsToOmitBeforePersisting),
        automaticBlockedDate: caseToCreate.automaticBlockedDate
          ? calculateDate({ dateString: caseToCreate.automaticBlockedDate })
          : undefined,
        blockedDate: caseToCreate.blockedDate
          ? calculateDate({ dateString: caseToCreate.blockedDate })
          : undefined,
        caption: caseToCreate.caseCaption,
        closedDate: caseToCreate.closedDate
          ? calculateDate({ dateString: caseToCreate.closedDate })
          : undefined,
        createdAt: calculateDate({ dateString: caseToCreate.createdAt }),
        irsNoticeDate: caseToCreate.irsNoticeDate
          ? calculateDate({ dateString: caseToCreate.irsNoticeDate })
          : undefined,
        noticeOfTrialDate: caseToCreate.noticeOfTrialDate
          ? calculateDate({ dateString: caseToCreate.noticeOfTrialDate })
          : undefined,
        petitionPaymentDate: caseToCreate.petitionPaymentDate
          ? calculateDate({ dateString: caseToCreate.petitionPaymentDate })
          : undefined,
        petitionPaymentWaivedDate: caseToCreate.petitionPaymentWaivedDate
          ? calculateDate({
              dateString: caseToCreate.petitionPaymentWaivedDate,
            })
          : undefined,
        receivedAt: calculateDate({ dateString: caseToCreate.receivedAt }),
        sealedDate: caseToCreate.sealedDate
          ? calculateDate({ dateString: caseToCreate.sealedDate })
          : undefined,
        trialDate: caseToCreate.trialDate
          ? calculateDate({ dateString: caseToCreate.trialDate })
          : undefined,
      })
      .execute(),
  );
};
