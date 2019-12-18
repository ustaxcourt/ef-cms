import { fakeFile, setupTest } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkCreatesACaseDeadline from './journey/petitionsClerkCreatesACaseDeadline';
import petitionsClerkDeletesCaseDeadline from './journey/petitionsClerkDeletesCaseDeadline';
import petitionsClerkEditsCaseDeadline from './journey/petitionsClerkEditsCaseDeadline';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkViewCaseDeadline from './journey/petitionsClerkViewCaseDeadline';
import petitionsClerkViewsCaseWithNoDeadlines from './journey/petitionsClerkViewsCaseWithNoDeadlines';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('View and manage the deadlines of a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  const createdIds = [];

  describe('Create a case', () => {
    petitionerLogin(test);
    petitionerNavigatesToCreateCase(test);
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    petitionerViewsDashboard(test);
    captureCreatedCase(test, createdIds);
    userSignsOut(test);
  });

  describe('View a case with no deadlines', () => {
    petitionsClerkLogIn(test);
    petitionsClerkViewsCaseWithNoDeadlines(test);
    userSignsOut(test);
  });

  describe('Create a case deadline', () => {
    petitionsClerkLogIn(test);
    petitionsClerkCreatesACaseDeadline(test);
    userSignsOut(test);
  });

  describe('View a case deadline list on case', () => {
    petitionsClerkLogIn(test);
    petitionsClerkViewCaseDeadline(test);
    userSignsOut(test);
  });

  describe('Edit a case deadline on case', () => {
    petitionsClerkLogIn(test);
    petitionsClerkEditsCaseDeadline(test);
    userSignsOut(test);
  });

  describe('Delete a case deadline on case', () => {
    petitionsClerkLogIn(test);
    petitionsClerkDeletesCaseDeadline(test);
    userSignsOut(test);
  });

  describe('View a case with no deadlines', () => {
    petitionsClerkLogIn(test);
    petitionsClerkViewsCaseWithNoDeadlines(test);
    userSignsOut(test);
  });
});
