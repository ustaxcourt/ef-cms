import { fakeFile, setupTest } from './helpers';

// docketClerk
import docketClerkChecksDocketEntryEditLink from './journey/docketClerkChecksDocketEntryEditLink';
import docketClerkEditsDocketEntryMeta from './journey/docketClerkEditsDocketEntryMeta';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkNavigatesToEditDocketEntryMeta from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import docketClerkQCsDocketEntry from './journey/docketClerkQCsDocketEntry';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkVerifiesDocketEntryMetaUpdates from './journey/docketClerkVerifiesDocketEntryMetaUpdates';

// petitioner
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerFilesADocumentForCase from './journey/petitionerFilesADocumentForCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';

const test = setupTest();
test.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerFilesADocumentForCase(test, fakeFile);
  petitionerSignsOut(test);

  docketClerkLogIn(test);
  docketClerkChecksDocketEntryEditLink(test);
  docketClerkQCsDocketEntry(test);
  docketClerkChecksDocketEntryEditLink(test, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(test, 3);
  docketClerkEditsDocketEntryMeta(test);
  docketClerkVerifiesDocketEntryMetaUpdates(test, 3);

  docketClerkSignsOut(test);
});
