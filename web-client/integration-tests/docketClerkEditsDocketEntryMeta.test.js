import { fakeFile, loginAs, setupTest } from './helpers';

// docketClerk
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkEditsDocketEntryMeta } from './journey/docketClerkEditsDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkVerifiesDocketEntryMetaUpdates } from './journey/docketClerkVerifiesDocketEntryMetaUpdates';

// petitioner
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';

const test = setupTest();
test.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerFilesADocumentForCase(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkChecksDocketEntryEditLink(test);
  docketClerkQCsDocketEntry(test);
  docketClerkChecksDocketEntryEditLink(test, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(test, 3);
  docketClerkEditsDocketEntryMeta(test);
  docketClerkVerifiesDocketEntryMetaUpdates(test, 3);
});
