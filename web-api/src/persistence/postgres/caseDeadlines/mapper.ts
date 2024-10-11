import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { NewCaseDeadlineKysely } from '@web-api/database-types';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

function pickFields(deadline): NewCaseDeadlineKysely {
  return {
    associatedJudge: deadline.associatedJudge,
    associatedJudgeId: deadline.associatedJudgeId,
    caseDeadlineId: deadline.caseDeadlineId,
    createdAt: deadline.createdAt,
    deadlineDate: deadline.deadlineDate,
    description: deadline.description,
    docketNumber: deadline.docketNumber,
    sortableDocketNumber: deadline.sortableDocketNumber,
  };
}

// export function toKyselyUpdateMessage(
//   message: RawMessage,
// ): UpdateMessageKysely {
//   return pickFields(message);
// }

// export function toKyselyUpdateMessages(
//   messages: RawMessage[],
// ): UpdateMessageKysely[] {
//   return messages.map(pickFields);
// }

export function toKyselyNewCaseDeadline(
  deadline: RawCaseDeadline,
): NewCaseDeadlineKysely {
  return pickFields(deadline);
}

// export function toKyselyNewMessages(
//   messages: RawMessage[],
// ): NewMessageKysely[] {
//   return messages.map(pickFields);
// }

export function caseDeadlineEntity(caseDeadline) {
  return new CaseDeadline(
    transformNullToUndefined({
      ...caseDeadline,
      createdAt: caseDeadline.createdAt.toISOString(),
      deadlineDate: caseDeadline.deadlineDate?.toISOString(),
    }),
  );
}
