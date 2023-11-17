import { applicationContext } from '../src/applicationContext';
import { blockedCasesReportHelper } from '../src/presenter/computeds/blockedCasesReportHelper';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Manually block consolidated cases', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;

  let leadDocketNumber;
  let memberCaseDocketNumber;

  const blockedCasesReportHelperComputed = withAppContextDecorator(
    blockedCasesReportHelper,
    applicationContext,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, {
    procedureType: 'Regular',
    trialLocation,
  });

  it('creates lead case', () => {
    const caseDetail = cerebralTest.getState('caseDetail');
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
    leadDocketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, {
    procedureType: 'Regular',
    trialLocation,
  });

  it('should set member case docket number', () => {
    memberCaseDocketNumber = cerebralTest.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('should set case docket number to leadDocketNumber', () => {
    cerebralTest.docketNumber = leadDocketNumber;
  });
  petitionsClerkBlocksCase(cerebralTest, trialLocation);
  it('should verify blocked case has isLeadCase flag, inConsolidatedGroup flag and "Lead case" tool tip', () => {
    const { blockedCasesFormatted } = runCompute(
      blockedCasesReportHelperComputed,
      {
        state: cerebralTest.getState(),
      },
    );
    expect(blockedCasesFormatted).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          consolidatedIconTooltipText: 'Lead case',
          inConsolidatedGroup: true,
          isLeadCase: true,
        }),
      ]),
    );
  });

  it('should set case docket number to memberCaseDocketNumber', () => {
    cerebralTest.docketNumber = memberCaseDocketNumber;
  });
  petitionsClerkBlocksCase(cerebralTest, trialLocation);
  it('should verify blocked case does NOT have isLeadCase flag, but has inConsolidatedGroup flag and "Consolidated case" tool tip', () => {
    const { blockedCasesFormatted } = runCompute(
      blockedCasesReportHelperComputed,
      {
        state: cerebralTest.getState(),
      },
    );
    expect(blockedCasesFormatted).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          consolidatedIconTooltipText: 'Consolidated case',
          inConsolidatedGroup: true,
          isLeadCase: false,
        }),
      ]),
    );
  });
});
