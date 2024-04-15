import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { userMap } from '../../shared/src/test/mockUserTokenMap';
import axios from 'axios';
import jwt from 'jsonwebtoken';

describe('View and manage the deadlines of a case', () => {
  const cerebralTest = setupTest();

  let userToken;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a case', () => {
    loginAs(cerebralTest, 'petitionsclerk1@example.com');
    petitionsClerkCreatesNewCase(cerebralTest);
  });

  it('gets a v2 case', async () => {
    const loginUsername = 'irssuperuser@example.com';
    if (!userMap[loginUsername]) {
      throw new Error(`Unable to log into test as ${loginUsername}`);
    }
    const user = {
      ...userMap[loginUsername],
      'custom:userId': userMap[loginUsername].userId,
    };

    userToken = jwt.sign(user, 'secret');

    const { data: response } = await axios.get(
      `http://localhost:4000/v2/cases/${cerebralTest.docketNumber}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    cerebralTest.docketEntryId = response.docketEntries.find(
      entry => entry.eventCode === 'RQT',
    ).docketEntryId;

    expect(response).toMatchObject({
      caseCaption:
        'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
      caseType: 'Deficiency',
      contactPrimary: {
        address1: '123 Abc Ln',
        city: 'Cityville',
        name: 'Daenerys Stormborn',
        phone: '123-456-7890',
        postalCode: '23-skidoo',
        serviceIndicator: 'Paper',
      },
      docketEntries: expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: expect.anything(),
          eventCode: 'RQT',
          eventCodeDescription: 'Request for Place of Trial',
          filedBy: 'Petr. Daenerys Stormborn',
          filingDate: expect.anything(),
          index: 4,
          isFileAttached: true,
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          docketEntryId: expect.anything(),
          eventCode: 'P',
          eventCodeDescription: 'Petition',
          filedBy: 'Petr. Daenerys Stormborn',
          filingDate: expect.anything(),
          index: 1,
          isFileAttached: true,
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          docketEntryId: expect.anything(),
          eventCode: 'APW',
          eventCodeDescription: 'Application for Waiver of Filing Fee',
          filedBy: 'Petr. Daenerys Stormborn',
          filingDate: expect.anything(),
          index: 2,
          isFileAttached: true,
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          docketEntryId: expect.anything(),
          eventCode: 'DISC',
          eventCodeDescription: 'Corporate Disclosure Statement',
          filedBy: 'Petr. Daenerys Stormborn',
          filingDate: expect.anything(),
          index: 3,
          isFileAttached: true,
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          docketEntryId: expect.anything(),
          eventCode: 'STIN',
          eventCodeDescription: 'Statement of Taxpayer Identification',
          filedBy: 'Petr. Daenerys Stormborn',
          filingDate: expect.anything(),
          index: 0,
          isFileAttached: true,
          servedAt: expect.anything(),
        }),
      ]),
      docketNumber: cerebralTest.docketNumber,
      docketNumberSuffix: 'S',
      partyType: 'Petitioner',
      practitioners: [],
      preferredTrialCity: 'Birmingham, Alabama',
      respondents: [],
      sortableDocketNumber: expect.anything(),
      status: 'General Docket - Not at Issue',
    });
  });

  it('gets the document-download-url for a v2 case', async () => {
    const { data: response } = await axios.get(
      `http://localhost:4000/v2/cases/${cerebralTest.docketNumber}/entries/${cerebralTest.docketEntryId}/document-download-url`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    expect(response.url).toContain(
      `http://0.0.0.0:9001/noop-documents-local-us-east-1/${cerebralTest.docketEntryId}`,
    );
  });

  it('gets the v2 reconciliation report for the provided date', async () => {
    const { data: response } = await axios.get(
      'http://localhost:4000/v2/reconciliation-report/today',
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    expect(response).toMatchObject({
      docketEntries: expect.arrayContaining([]),
      reconciliationDate: expect.anything(),
      reportTitle: 'Reconciliation Report',
      totalDocketEntries: expect.any(Number),
    });
  });
});
