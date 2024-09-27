import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/deleteUserCaseNote.ts',
  () => mockFactory('deleteUserCaseNote'),
);

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/getUserCaseNote.ts',
  () => mockFactory('getUserCaseNote'),
);

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/getUserCaseNoteForCases.ts',
  () => mockFactory('getUserCaseNoteForCases'),
);

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/updateUserCaseNote.ts',
  () => mockFactory('updateUserCaseNote'),
);
