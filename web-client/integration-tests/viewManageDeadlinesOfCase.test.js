import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkDeletesCaseDeadline } from './journey/petitionsClerkDeletesCaseDeadline';
import { petitionsClerkEditsCaseDeadline } from './journey/petitionsClerkEditsCaseDeadline';
import { petitionsClerkViewCaseDeadline } from './journey/petitionsClerkViewCaseDeadline';
import { petitionsClerkViewsCaseWithNoDeadlines } from './journey/petitionsClerkViewsCaseWithNoDeadlines';
import { petitionsClerkViewsDeadlineReportForSingleCase } from './journey/petitionsClerkViewsDeadlineReportForSingleCase';

const cerebralTest = setupTest();

describe('View and manage the deadlines of a case', () => {
  const randomDay = `0${Math.floor(Math.random() * 9) + 1}`;
  const randomMonth = `0${Math.floor(Math.random() * 9) + 1}`;
  const randomYear = `200${Math.floor(Math.random() * 9) + 1}`;

  const overrides = {
    day: randomDay,
    month: randomMonth,
    year: randomYear,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a case', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('login as a petitioner and create a case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });
  });

  describe('View a case with no deadlines', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(cerebralTest);
  });

  describe('Create 2 case deadlines', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesACaseDeadline(cerebralTest, overrides);
    petitionsClerkCreatesACaseDeadline(cerebralTest, overrides);
  });

  describe('View case deadline list on case', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewCaseDeadline(cerebralTest);
  });

  describe('View the deadlines report', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReportForSingleCase(cerebralTest, overrides);
  });

  describe('Edit a case deadline on case', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkEditsCaseDeadline(cerebralTest);
  });

  describe('Delete case deadlines on case', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkDeletesCaseDeadline(cerebralTest);
    petitionsClerkDeletesCaseDeadline(cerebralTest);
  });

  describe('View a case with no deadlines', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(cerebralTest);
  });
});
