import { fakeFile, setupTest } from './helpers';
import petitionerAddNewCaseToTestObj from './journey/petitionerAddNewCaseToTestObj';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Case Confirmation', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  describe('Petitoner creates a case / Petitionsclerk Sends to Holding Queue / User then has access to case confirmation', () => {
    petitionerLogin(test);
    petitionerNavigatesToCreateCase(test);
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    petitionerAddNewCaseToTestObj(test);
    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    userSignsOut(test);
  });

  describe('Petitonsclerk creates a case and qcs another', () => {
    petitionsClerkLogIn(test);
    petitionsClerkCreatesNewCase(test, fakeFile);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    userSignsOut(test);
  });

  describe('Cases Are served to the IRS', () => {
    petitionsClerkLogIn(test);
    petitionsClerkRunsBatchProcess(test);
    userSignsOut(test);
  });

  describe('Result petitoner sees the link to view the case confirmation created', () => {});

  describe('Petitonsclerk gets a workitem message and has the ability to print the case confirmation', () => {});
});
