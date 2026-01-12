import {
  RawUserCaseNote,
  UserCaseNote,
} from '@shared/business/entities/notes/UserCaseNote';
import {
  NewUserCaseNoteKysely,
  UserCaseNoteKysely,
} from '@web-api/persistence/postgres/userCaseNotes/schema';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export function toKyselyNewUserCaseNote({
  userCaseNote,
}: {
  userCaseNote: RawUserCaseNote;
}): NewUserCaseNoteKysely {
  return {
    docketNumber: userCaseNote.docketNumber,
    notes: userCaseNote.notes,
    userId: userCaseNote.userId,
  };
}

export function fromKyselyUserCaseNote(
  userCaseNote: UserCaseNoteKysely,
): UserCaseNote {
  return new UserCaseNote(transformNullToUndefined(userCaseNote));
}
