import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/deleteUserCaseNote.ts',
  () => mockFactory('deleteUserCaseNote'),
);

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/getUserCaseNotes.ts',
  () => mockFactory('getUserCaseNotes'),
);

jest.mock(
  '@web-api/persistence/postgres/userCaseNotes/upsertUserCaseNotes.ts',
  () => mockFactory('upsertUserCaseNotes'),
);
