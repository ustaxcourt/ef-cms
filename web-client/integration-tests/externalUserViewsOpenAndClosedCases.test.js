import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { userViewsOpenClosedCases } from './journey/userViewsOpenClosedCases';

const test = setupTest();

describe('external user views open and closed cases', () => {
  let expectedDashboardName;
  let expectedClosedCases = 0;
  let caseType = 'openCases';

  beforeAll(() => {
    jest.setTimeout(30000);
    loginAs(test, 'docketclerk');
  });

  beforeEach(async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'petitioner');
  expectedDashboardName = 'DashboardPetitioner';
  userViewsOpenClosedCases(
    test,
    expectedDashboardName,
    expectedClosedCases,
    caseType,
  );

  loginAs(test, 'privatePractitioner');
  expectedDashboardName = 'DashboardPractitioner';
  userViewsOpenClosedCases(
    test,
    expectedDashboardName,
    expectedClosedCases,
    caseType,
  );

  loginAs(test, 'irsPractitioner');
  expectedDashboardName = 'DashboardRespondent';
  userViewsOpenClosedCases(
    test,
    expectedDashboardName,
    expectedClosedCases,
    caseType,
  );

  loginAs(test, 'docketclerk');
  docketClerkUpdatesCaseStatusToClosed(test);

  loginAs(test, 'irsPractitioner');
  expectedDashboardName = 'DashboardRespondent';
  caseType = 'closedCases';
  expectedClosedCases = 1;
  userViewsOpenClosedCases(
    test,
    expectedDashboardName,
    expectedClosedCases,
    caseType,
  );

  loginAs(test, 'docketclerk');
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
});
