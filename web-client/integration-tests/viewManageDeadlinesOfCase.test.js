import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkDeletesCaseDeadline } from './journey/petitionsClerkDeletesCaseDeadline';
import { petitionsClerkEditsCaseDeadline } from './journey/petitionsClerkEditsCaseDeadline';
import { petitionsClerkViewCaseDeadline } from './journey/petitionsClerkViewCaseDeadline';
import { petitionsClerkViewsCaseWithNoDeadlines } from './journey/petitionsClerkViewsCaseWithNoDeadlines';
import { petitionsClerkViewsDeadlineReportForSingleCase } from './journey/petitionsClerkViewsDeadlineReportForSingleCase';

const test = setupTest();

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

  describe('Create a case', () => {
    loginAs(test, 'petitioner@example.com');
    it('login as a petitioner and create a case', async () => {
      const caseDetail = await uploadPetition(test);
      expect(caseDetail.docketNumber).toBeDefined();
      test.docketNumber = caseDetail.docketNumber;
    });
  });

  describe('View a case with no deadlines', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(test);
  });

  describe('Create 2 case deadlines', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkCreatesACaseDeadline(test, overrides);
    petitionsClerkCreatesACaseDeadline(test, overrides);
  });

  describe('View case deadline list on case', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewCaseDeadline(test);
  });

  describe('View the deadlines report', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReportForSingleCase(test, overrides);
  });

  describe('Edit a case deadline on case', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkEditsCaseDeadline(test);
  });

  describe('Delete case deadlines on case', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkDeletesCaseDeadline(test);
    petitionsClerkDeletesCaseDeadline(test);
  });

  describe('View a case with no deadlines', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(test);
  });
});
