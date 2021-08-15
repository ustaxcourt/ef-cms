import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkEditsDocketEntryNonstandardA } from './journey/docketClerkEditsDocketEntryNonstandardA';
import { docketClerkEditsDocketEntryNonstandardB } from './journey/docketClerkEditsDocketEntryNonstandardB';
import { docketClerkEditsDocketEntryNonstandardC } from './journey/docketClerkEditsDocketEntryNonstandardC';
import { docketClerkEditsDocketEntryNonstandardD } from './journey/docketClerkEditsDocketEntryNonstandardD';
import { docketClerkEditsDocketEntryNonstandardE } from './journey/docketClerkEditsDocketEntryNonstandardE';
import { docketClerkEditsDocketEntryNonstandardF } from './journey/docketClerkEditsDocketEntryNonstandardF';
import { docketClerkEditsDocketEntryNonstandardG } from './journey/docketClerkEditsDocketEntryNonstandardG';
import { docketClerkEditsDocketEntryNonstandardH } from './journey/docketClerkEditsDocketEntryNonstandardH';
import { docketClerkEditsDocketEntryStandard } from './journey/docketClerkEditsDocketEntryStandard';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('docket clerk updates docket entries', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsDocketEntryWithoutFile(cerebralTest);
  docketClerkEditsDocketEntryStandard(cerebralTest);
  docketClerkEditsDocketEntryNonstandardA(cerebralTest);
  docketClerkEditsDocketEntryNonstandardB(cerebralTest);
  docketClerkEditsDocketEntryNonstandardC(cerebralTest);
  docketClerkEditsDocketEntryNonstandardD(cerebralTest);
  docketClerkEditsDocketEntryNonstandardE(cerebralTest);
  docketClerkEditsDocketEntryNonstandardF(cerebralTest);
  docketClerkEditsDocketEntryNonstandardG(cerebralTest);
  docketClerkEditsDocketEntryNonstandardH(cerebralTest);
});
