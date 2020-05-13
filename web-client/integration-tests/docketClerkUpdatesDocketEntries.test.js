import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkEditsDocketEntryNonstandardA } from './journey/docketClerkEditsDocketEntryNonstandardA';
import { docketClerkEditsDocketEntryNonstandardB } from './journey/docketClerkEditsDocketEntryNonstandardB';
import { docketClerkEditsDocketEntryNonstandardC } from './journey/docketClerkEditsDocketEntryNonstandardC';
// import { docketClerkEditsDocketEntryNonstandardD } from './journey/docketClerkEditsDocketEntryNonstandardD';
// import { docketClerkEditsDocketEntryNonstandardE } from './journey/docketClerkEditsDocketEntryNonstandardE';
// import { docketClerkEditsDocketEntryNonstandardF } from './journey/docketClerkEditsDocketEntryNonstandardF';
// import { docketClerkEditsDocketEntryNonstandardG } from './journey/docketClerkEditsDocketEntryNonstandardG';
// import { docketClerkEditsDocketEntryNonstandardH } from './journey/docketClerkEditsDocketEntryNonstandardH';
// import { docketClerkEditsDocketEntryNonstandardI } from './journey/docketClerkEditsDocketEntryNonstandardI';
// import { docketClerkEditsDocketEntryNonstandardJ } from './journey/docketClerkEditsDocketEntryNonstandardJ';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { docketClerkEditsDocketEntryStandard } from './journey/docketClerkEditsDocketEntryStandard';
import { docketClerkSavesDocketEntry } from './journey/docketClerkSavesDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';

const test = setupTest();
test.draftOrders = [];

describe('docket clerk updates docket entries', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: 'domestic',
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });
  petitionerFilesADocumentForCase(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkAddsDocketEntryWithoutFile(test);
  docketClerkSavesDocketEntry(test, false);
  docketClerkEditsDocketEntryStandard(test);
  docketClerkEditsDocketEntryNonstandardA(test);
  docketClerkEditsDocketEntryNonstandardB(test);
  docketClerkEditsDocketEntryNonstandardC(test);
  // docketClerkEditsDocketEntryNonstandardD(test);
  // docketClerkEditsDocketEntryNonstandardE(test);
  // docketClerkEditsDocketEntryNonstandardF(test);
  // docketClerkEditsDocketEntryNonstandardG(test);
  // docketClerkEditsDocketEntryNonstandardH(test);
  // docketClerkEditsDocketEntryNonstandardI(test);
  // docketClerkEditsDocketEntryNonstandardJ(test);
});
