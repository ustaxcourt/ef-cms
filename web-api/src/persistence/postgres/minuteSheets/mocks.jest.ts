import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/minuteSheets/getMinuteSheetsByTrialSession',
  () => mockFactory('getMinuteSheetsByTrialSession'),
);
