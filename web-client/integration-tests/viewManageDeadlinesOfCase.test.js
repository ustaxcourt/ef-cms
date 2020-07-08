import { captureCreatedCase } from './journey/captureCreatedCase';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkDeletesCaseDeadline } from './journey/petitionsClerkDeletesCaseDeadline';
import { petitionsClerkEditsCaseDeadline } from './journey/petitionsClerkEditsCaseDeadline';
import { petitionsClerkViewCaseDeadline } from './journey/petitionsClerkViewCaseDeadline';
import { petitionsClerkViewsCaseWithNoDeadlines } from './journey/petitionsClerkViewsCaseWithNoDeadlines';
import { petitionsClerkViewsDeadlineReport } from './journey/petitionsClerkViewsDeadlineReport';

const test = setupTest();

describe('View and manage the deadlines of a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  const createdIds = [];

  describe('Create a case', () => {
    loginAs(test, 'petitioner@example.com');
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    petitionerViewsDashboard(test);
    captureCreatedCase(test, createdIds);
  });

  describe('View a case with no deadlines', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(test);
  });

  describe('Create a case deadline', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkCreatesACaseDeadline(test);
  });

  describe('View a case deadline list on case', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewCaseDeadline(test);
  });

  describe('Edit a case deadline on case', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkEditsCaseDeadline(test);
  });

  describe('Delete a case deadline on case', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkDeletesCaseDeadline(test);
  });

  describe('View a case with no deadlines', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(test);
  });

  describe('View the deadlines report', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReport(test);
  });
});
