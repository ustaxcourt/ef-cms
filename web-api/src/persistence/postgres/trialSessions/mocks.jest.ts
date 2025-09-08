import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/trialSessions/createTrialSession',
  () => mockFactory('createTrialSession'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/createTrialSessionNotificationProcessing',
  () => mockFactory('createTrialSessionNotificationProcessing'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/createTrialSessionWorkingCopy',
  () => mockFactory('createTrialSessionWorkingCopy'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/deleteTrialSession',
  () => mockFactory('deleteTrialSession'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/deleteTrialSessionWorkingCopy',
  () => mockFactory('deleteTrialSessionWorkingCopy'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession',
  () => mockFactory('getCalendaredCasesForTrialSession'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/getTrialSessionById',
  () => mockFactory('getTrialSessionById'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/getTrialSessionNotificationProcessing',
  () => mockFactory('getTrialSessionNotificationProcessing'),
);

jest.mock('@web-api/persistence/postgres/trialSessions/getTrialSessions', () =>
  mockFactory('getTrialSessions'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/getTrialSessionWorkingCopies',
  () => mockFactory('getTrialSessionWorkingCopies'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/removeCaseFromTrialSession',
  () => mockFactory('removeCaseFromTrialSession'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/updateTrialSession',
  () => mockFactory('updateTrialSession'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/updateTrialSessionNotificationProcessing',
  () => mockFactory('updateTrialSessionNotificationProcessing'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/upsertTrialSessionWorkingCopy',
  () => mockFactory('upsertTrialSessionWorkingCopy'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases',
  () => mockFactory('createOrUpdateTrialSessionCases'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/deleteCasesFromTrialSession',
  () => mockFactory('deleteCasesFromTrialSession'),
);

jest.mock(
  '@web-api/persistence/postgres/trialSessions/removeCasesFromHearings',
  () => mockFactory('removeCasesFromHearings'),
);
