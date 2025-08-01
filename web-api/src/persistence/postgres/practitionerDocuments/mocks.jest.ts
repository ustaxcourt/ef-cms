import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/practitionerDocuments/createOrEditPractitionerDocument.ts',
  () => mockFactory('createOrEditPractitionerDocument'),
);

jest.mock(
  '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocumentByFileId.ts',
  () => mockFactory('getPractitionerDocumentByFileId', []),
);

jest.mock(
  '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocuments.ts',
  () => mockFactory('getPractitionerDocuments', []),
);

jest.mock(
  '@web-api/persistence/postgres/practitionerDocuments/deletePractitionerDocument.ts',
  () => mockFactory('deletePractitionerDocument'),
);
