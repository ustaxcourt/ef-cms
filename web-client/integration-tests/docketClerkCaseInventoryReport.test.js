import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { caseInventoryReportHelper as caseInventoryReportHelperComputed } from '../src/presenter/computeds/caseInventoryReportHelper';
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

const cerebralTest = setupTest();

describe('case inventory report journey', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const initialCaseInventoryCounts = {};
  const createdDocketNumbers = [];
  // eslint-disable-next-line @miovision/disallow-date/no-static-date
  const trialLocation = `Indianapolis, Indiana, ${Date.now()}`;

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('cache the initial case inventory counts', async () => {
    await cerebralTest.runSequence('openCaseInventoryReportModalSequence');

    const caseInventoryReportHelper = withAppContextDecorator(
      caseInventoryReportHelperComputed,
    );

    const helper = runCompute(caseInventoryReportHelper, {
      state: cerebralTest.getState(),
    });

    const legacyJudge = helper.judges.find(
      judge => judge.role === 'legacyJudge',
    );

    expect(legacyJudge).toBeFalsy();

    //New
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.new = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //New, Judge Colvin
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.newColvin = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared, Judge Colvin
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendaredColvin = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendared = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //Judge Colvin
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.colvin = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
  });

  //Create a trial session and set as calendared
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    judge: {
      name: 'Judge Colvin',
      userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
    },
    trialLocation,
  });
  docketClerkViewsTrialSessionList(cerebralTest);
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  for (let i = 0; i < 2; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('manually add first case to the trial session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdDocketNumbers[0],
    });
    await cerebralTest.runSequence('openAddToTrialModalSequence');
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });
    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
  });

  it('get the updated case inventory counts', async () => {
    await refreshElasticsearchIndex();

    //New (+1 from initial)
    await cerebralTest.runSequence('openCaseInventoryReportModalSequence');
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    let updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.new + 1,
    );
    //New, Judge Colvin (same as initial)
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.newColvin,
    );
    //Calendared, Judge Colvin (+1 from initial)
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendaredColvin + 1,
    );
    //Calendared (+1 from initial)
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendared + 1,
    );
    //Judge Colvin (+1 from initial)
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.colvin + 1,
    );
  });

  it('view the printable report', async () => {
    await cerebralTest.runSequence('gotoPrintableCaseInventoryReportSequence');
  });
});
