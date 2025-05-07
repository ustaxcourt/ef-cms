import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/practitioners/barNumberGenerator',
  () => mockFactory('barNumberGenerator'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/createNewPractitionerUser',
  () => mockFactory('createNewPractitionerUser'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/createOrUpdatePractitionerUser',
  () => mockFactory('createOrUpdatePractitionerUser'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/deletePractitionerRecord',
  () => mockFactory('deletePractitionerRecord'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/getIrsPractitionersOnCase',
  () => mockFactory('getIrsPractitionersOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/getPractitionersByDocketNumber',
  () => mockFactory('getPractitionersByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/getPractitionerByBarNumber',
  () => mockFactory('getPractitionerByBarNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/getPractitionerById',
  () => mockFactory('getPractitionerById'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/getPractitionersBySearchKey',
  () => mockFactory('getPractitionersBySearchKey'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/getPrivatePractitionersOnCase',
  () => mockFactory('getPrivatePractitionersOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/updatePractitioner',
  () => mockFactory('updatePractitioner'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/updatePractitionerUser',
  () => mockFactory('updatePractitionerUser'),
);

jest.mock(
  '@web-api/persistence/postgres/practitioners/upsertPractitionerRecord',
  () => mockFactory('upsertPractitionerRecord'),
);
