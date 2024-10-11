import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

// function pickFields(deadline): NewCaseCorrespondenceKysely {
//   return {
//     associatedJudge: deadline.associatedJudge,
//     associatedJudgeId: deadline.associatedJudgeId,
//     caseDeadlineId: deadline.caseDeadlineId,
//     createdAt: deadline.createdAt,
//     deadlineDate: deadline.deadlineDate,
//     description: deadline.description,
//     docketNumber: deadline.docketNumber,
//     sortableDocketNumber: deadline.sortableDocketNumber,
//   };
// }

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

// export function toKyselyNewCaseDeadline(
//   deadline: RawCaseDeadline,
// ): NewCaseDeadlineKysely {
//   return pickFields(deadline);
// }

// export function toKyselyNewMessages(
//   messages: RawMessage[],
// ): NewMessageKysely[] {
//   return messages.map(pickFields);
// }

export function caseWorksheetEntity(caseWorksheet) {
  return new CaseWorksheet(
    transformNullToUndefined({
      ...caseWorksheet,
      filingDate: caseWorksheet.finalBriefDueDate.toISOString(),
    }),
  );
}
