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
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('case inventory report journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const initialCaseInventoryCounts: {
    calendared: number | undefined;
    calendaredColvin: number | undefined;
    colvin: number | undefined;
    new: number | undefined;
    newColvin: number | undefined;
  } = {
    calendared: undefined,
    calendaredColvin: undefined,
    colvin: undefined,
    new: undefined,
    newColvin: undefined,
  };

  const createdDocketNumbers: string[] = [];

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('cache the initial case inventory counts', async () => {
    await refreshElasticsearchIndex();
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
    trialLocation: `Indianapolis, Indiana, ${Date.now()}`,
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

  it('should navigate to the case inventory report and check for new case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('openCaseInventoryReportModalSequence');
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    const updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );

    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.new! + 1,
    );
  });

  it('should get the updated new case inventory count for Judge Colvin', async () => {
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    const updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.newColvin,
    );
  });

  it('should get the updated calendared case inventory count for Judge Colvin', async () => {
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    const updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendaredColvin! + 1,
    );
  });

  it('should get the updated total calendared case inventory count', async () => {
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    const updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendared! + 1,
    );
  });

  it('should get the updated total case inventory count for Judge Colvin', async () => {
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await cerebralTest.runSequence('submitCaseInventoryReportModalSequence');
    const updatedCaseInventoryCount = cerebralTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.colvin! + 1,
    );
  });

  it('view the printable report', async () => {
    await cerebralTest.runSequence('gotoPrintableCaseInventoryReportSequence');
  });
});
