import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { caseInventoryReportHelper as caseInventoryReportHelperComputed } from '../src/presenter/computeds/caseInventoryReportHelper';
1;
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const test = setupTest();

describe('case inventory report journey', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const initialCaseInventoryCounts = {};
  const createdDocketNumbers = [];
  const trialLocation = `Indianapolis, Indiana, ${Date.now()}`;

  loginAs(test, 'docketclerk@example.com');
  it('cache the initial case inventory counts', async () => {
    await test.runSequence('openCaseInventoryReportModalSequence');

    const caseInventoryReportHelper = withAppContextDecorator(
      caseInventoryReportHelperComputed,
    );

    const helper = runCompute(caseInventoryReportHelper, {
      state: test.getState(),
    });

    const legacyJudge = helper.judges.find(
      judge => judge.role === 'legacyJudge',
    );

    expect(legacyJudge).toBeFalsy();

    //New
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.new = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //New, Judge Colvin
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.newColvin = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared, Judge Colvin
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendaredColvin = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendared = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //Judge Colvin
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.colvin = test.getState(
      'caseInventoryReportData.totalCount',
    );
  });

  //Create a trial session and set as calendared
  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, {
    judge: {
      name: 'Judge Colvin',
      userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
    },
    trialLocation,
  });
  docketClerkViewsTrialSessionList(test, { trialLocation });
  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'petitioner@example.com');
  for (let i = 0; i < 2; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(test);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  loginAs(test, 'docketclerk@example.com');
  it('manually add first case to the trial session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdDocketNumbers[0],
    });
    await test.runSequence('openAddToTrialModalSequence');
    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.trialSessionId,
    });
    await test.runSequence('addCaseToTrialSessionSequence');
  });

  it('get the updated case inventory counts', async () => {
    await refreshElasticsearchIndex();

    //New (+1 from initial)
    await test.runSequence('openCaseInventoryReportModalSequence');
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    let updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.new + 1,
    );
    //New, Judge Colvin (same as initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.newColvin,
    );
    //Calendared, Judge Colvin (+1 from initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendaredColvin + 1,
    );
    //Calendared (+1 from initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendared + 1,
    );
    //Judge Colvin (+1 from initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.colvin + 1,
    );
  });

  it('view the printable report', async () => {
    await test.runSequence('gotoPrintableCaseInventoryReportSequence');
  });
});
