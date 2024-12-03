import { Case } from '@shared/business/entities/cases/Case';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { fieldsToOmitBeforePersisting } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';
import { omit } from 'lodash';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}) => {
  const updatedCase = await getDbWriter(writer =>
    writer
      .updateTable('dwCase')
      .set({
        ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
        automaticBlockedDate: caseToUpdate.automaticBlockedDate
          ? calculateDate({ dateString: caseToUpdate.automaticBlockedDate })
          : undefined,
        blockedDate: caseToUpdate.blockedDate
          ? calculateDate({ dateString: caseToUpdate.blockedDate })
          : undefined,
        caption: caseToUpdate.caseCaption,
        closedDate: caseToUpdate.closedDate
          ? calculateDate({ dateString: caseToUpdate.closedDate })
          : undefined,
        createdAt: calculateDate({ dateString: caseToUpdate.createdAt }),
        irsNoticeDate: caseToUpdate.irsNoticeDate
          ? calculateDate({ dateString: caseToUpdate.irsNoticeDate })
          : undefined,
        noticeOfTrialDate: caseToUpdate.noticeOfTrialDate
          ? calculateDate({ dateString: caseToUpdate.noticeOfTrialDate })
          : undefined,
        petitionPaymentDate: caseToUpdate.petitionPaymentDate
          ? calculateDate({ dateString: caseToUpdate.petitionPaymentDate })
          : undefined,
        petitionPaymentWaivedDate: caseToUpdate.petitionPaymentWaivedDate
          ? calculateDate({
              dateString: caseToUpdate.petitionPaymentWaivedDate,
            })
          : undefined,
        receivedAt: calculateDate({ dateString: caseToUpdate.receivedAt }),
        sealedDate: caseToUpdate.sealedDate
          ? calculateDate({ dateString: caseToUpdate.sealedDate })
          : undefined,
        trialDate: caseToUpdate.trialDate
          ? calculateDate({ dateString: caseToUpdate.trialDate })
          : undefined,
      })
      .where('docketNumber', '=', caseToUpdate.docketNumber)
      .returningAll()
      .executeTakeFirst(),
  );

  if (!updateCase) {
    throw new Error('could not update the case');
  }

  return new Case(transformNullToUndefined(updatedCase), {
    authorizedUser: undefined,
  });
};
