import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
// import { docketClerkEditsDocketEntryNonstandardA } from './journey/docketClerkEditsDocketEntryNonstandardA';
// import { docketClerkEditsDocketEntryNonstandardB } from './journey/docketClerkEditsDocketEntryNonstandardB';
// import { docketClerkEditsDocketEntryNonstandardC } from './journey/docketClerkEditsDocketEntryNonstandardC';
// import { docketClerkEditsDocketEntryNonstandardD } from './journey/docketClerkEditsDocketEntryNonstandardD';
// import { docketClerkEditsDocketEntryNonstandardE } from './journey/docketClerkEditsDocketEntryNonstandardE';
// import { docketClerkEditsDocketEntryNonstandardF } from './journey/docketClerkEditsDocketEntryNonstandardF';
// import { docketClerkEditsDocketEntryNonstandardG } from './journey/docketClerkEditsDocketEntryNonstandardG';
// import { docketClerkEditsDocketEntryNonstandardH } from './journey/docketClerkEditsDocketEntryNonstandardH';
// import { docketClerkEditsDocketEntryNonstandardI } from './journey/docketClerkEditsDocketEntryNonstandardI';
// import { docketClerkEditsDocketEntryNonstandardJ } from './journey/docketClerkEditsDocketEntryNonstandardJ';
import { docketClerkEditsDocketEntryStandard } from './journey/docketClerkEditsDocketEntryStandard';
import { docketClerkSavesDocketEntry } from './journey/docketClerkSavesDocketEntry';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();
test.draftOrders = [];

describe('docket clerk updates docket entries', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);

    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk');
  docketClerkAddsDocketEntryWithoutFile(test);
  docketClerkSavesDocketEntry(test, false);
  docketClerkEditsDocketEntryStandard(test);
  // docketClerkEditsDocketEntryNonstandardA(test);
  // docketClerkEditsDocketEntryNonstandardB(test);
  // docketClerkEditsDocketEntryNonstandardC(test);
  // docketClerkEditsDocketEntryNonstandardD(test);
  // docketClerkEditsDocketEntryNonstandardE(test);
  // docketClerkEditsDocketEntryNonstandardF(test);
  // docketClerkEditsDocketEntryNonstandardG(test);
  // docketClerkEditsDocketEntryNonstandardH(test);
  // docketClerkEditsDocketEntryNonstandardI(test);
  // docketClerkEditsDocketEntryNonstandardJ(test);
});
