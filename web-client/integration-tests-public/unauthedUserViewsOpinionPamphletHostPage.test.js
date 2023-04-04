import { applicationContextPublic } from '../src/applicationContextPublic';
import { docketClerkAddsOpiniontoDocketyEntry } from '../integration-tests/journey/docketClerkAddsOpinionToDocketEntry';
import { docketClerkCreatesAnOpinion } from '../integration-tests/journey/docketClerkCreatesAnOpinion';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import {
  fakeFile,
  loginAs,
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
  const totalNumberOfDocuments = 4;
  let formFieldValues;

  beforeAll(() => {
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    testClient.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');

  for (let i = 0; (i += 1); i <= totalNumberOfDocuments) {
    formFieldValues = {
      documentTitle: `Pamphlet ${i}`,
      documentType: 'Tax Court Report Pamhplet',
      eventCode: 'TCRP',
      filingDate: `2023-${i}-01T05:00:00.000Z`,
      freeText: `Pamphlet ${i}`,
      scenario: 'Type A',
    };

    it(`Create test case ${i} and serves a TCRP on it`, async () => {
      const { docketNumber } = await uploadPetition(testClient);

      expect(docketNumber).toBeDefined();

      testClient.docketNumber = docketNumber;
    });
  }

  loginAs(testClient, 'docketclerk@example.com');
  for (let i = 0; (i += 1); i <= totalNumberOfDocuments) {
    docketClerkCreatesAnOpinion(testClient, fakeFile);
    docketClerkAddsOpiniontoDocketyEntry(testClient, i, formFieldValues);
    docketClerkServesDocument(testClient, i);
  }

  it('unauthed user views opinion pamphlets host page', async () => {
    await testClient.runSequence('gotoOpinionPamphletsSequence', {});

    expect(testClient.getState('currentPage')).toEqual('OpinionPamphlets');

    const opinionPamphletsHelper = withAppContextDecorator(
      opinionPamphletsHelperComputed,
      applicationContextPublic,
    );

    const helper = runCompute(opinionPamphletsHelper, {
      state: testClient.getState(),
    });

    expect(helper.pamphletPeriods).toEqual(['2023']);
    expect(helper.pamphletsGroupedByFilingDate).toEqual({});
    expect(helper.yearAndFilingDateMap).toEqual({});
  });
});
