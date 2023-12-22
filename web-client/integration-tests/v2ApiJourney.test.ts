import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
// import { seedEntries } from 'web-api/storage/fixtures/seed';
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
      sub: userMap[loginUsername].userId,
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
      `http://0.0.0.0:9000/noop-documents-local-us-east-1/${cerebralTest.docketEntryId}`,
    );
  });

  it('gets the v2 reconciliation report for the provided date "today"', async () => {
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

  it('gets the v2 reconciliation report for the provided date', async () => {
    //use a date that will be found in our seed data
    // const dateArg = '2022-02-01';
    const dateArg = '2023-04-03T15:52:36Z';
    const { data: response } = await axios.get(
      `http://localhost:4000/v2/reconciliation-report/${dateArg}`,
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
    expect(response.totalDocketEntries).toBeGreaterThan(0);
  });

  describe('reconciliation report', () => {
    const loginUsername = 'irssuperuser@example.com';
    if (!userMap[loginUsername]) {
      throw new Error(`Unable to log into test as ${loginUsername}`);
    }
    const user = {
      ...userMap[loginUsername],
      sub: userMap[loginUsername].userId,
    };

    userToken = jwt.sign(user, 'secret');
    // TODO: find cases in seed data that have servedParties B or R
    // then find a day that has multiple cases
    // then test the following:
    //  - all cases on that day
    //  - filtered cases on that day with timeStart
    //  - filtered cases on that day with timeEnd
    //  - filtered cases on that day with timeStart and timeEnd

    it.todo('should show all cases from a particular day');
    it.todo(
      'should show cases that occur on a particular day after a specific start time',
    );
    it.todo(
      'should show cases that occur on a particular day before a specific end time',
    );
    it.todo(
      'should show cases that occur on a particular day between a start and end time',
    );
  });
});
