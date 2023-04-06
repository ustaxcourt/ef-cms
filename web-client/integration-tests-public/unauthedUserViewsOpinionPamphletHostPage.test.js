import { applicationContextPublic } from '../src/applicationContextPublic';
import { docketClerkAddsOpiniontoDocketEntry } from '../integration-tests/journey/docketClerkAddsOpinionToDocketEntry';
import { docketClerkCreatesAnOpinion } from '../integration-tests/journey/docketClerkCreatesAnOpinion';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { opinionPamphletsHelper as opinionPamphletsHelperComputed } from '../src/presenter/computeds/Public/opinionPamphletsHelper';
import { runCompute } from 'cerebral/test';
import { setupTest } from './helpers';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Unauthed user views opinion pamphlets host page', () => {
  const cerebralTest = setupTest();
  const testClient = setupTestClient();

  beforeAll(() => {
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    testClient.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');

  const formFieldValues = {
    documentTitle: 'Pamphlet filed on 01/01/2023',
    documentType: 'Tax Court Report Pamphlet',
    eventCode: 'TCRP',
    filingDate: '2023-01-01T05:00:00.000Z',
    filingDateDay: '01',
    filingDateMonth: '01',
    filingDateYear: '2023',
    freeText: 'Pamphlet filed on 01/01/2023',
    scenario: 'Type A',
  };

  it('Creates a case', async () => {
    const { docketNumber } = await uploadPetition(testClient);

    expect(docketNumber).toBeDefined();

    testClient.docketNumber = docketNumber;
  });

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOpinion(testClient, fakeFile);
  docketClerkAddsOpiniontoDocketEntry(testClient, 0, formFieldValues);

  it('unauthed user views opinion pamphlets host page', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoOpinionPamphletsSequence', {});

    expect(cerebralTest.getState('currentPage')).toEqual('OpinionPamphlets');

    const opinionPamphletsHelper = withAppContextDecorator(
      opinionPamphletsHelperComputed,
      applicationContextPublic,
    );

    expect(cerebralTest.getState('opinionPamphlets').length).toBeGreaterThan(0);

    const helper = runCompute(opinionPamphletsHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.pamphletPeriods).toEqual([formFieldValues.filingDateYear]);
  });
});
