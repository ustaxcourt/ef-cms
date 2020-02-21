import { fakeFile, setupTest, uploadPetition, wait } from './helpers';

import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkRemovesCaseFromTrial from './journey/docketClerkRemovesCaseFromTrial';
import docketClerkViewsSectionInboxHighPriority from './journey/docketClerkViewsSectionInboxHighPriority';
import docketClerkViewsSectionInboxNotHighPriority from './journey/docketClerkViewsSectionInboxNotHighPriority';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionerFilesDocumentForCase from './journey/petitionerFilesDocumentForCase';
import petitionerLogIn from './journey/petitionerLogIn';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('petitioner files document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  petitionerLogIn(test);
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });
  userSignsOut(test);

  docketClerkLogIn(test);
  docketClerkCreatesATrialSession(test);
  docketClerkViewsTrialSessionList(test);
  userSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkSetsATrialSessionsSchedule(test);
  it('manually add the case to the session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    await test.runSequence('openAddToTrialModalSequence');
    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.trialSessionId,
    });

    await test.runSequence('addCaseToTrialSessionSequence');
    await wait(5000);
  });
  userSignsOut(test);

  petitionerLogIn(test);
  petitionerFilesDocumentForCase(test, fakeFile);
  userSignsOut(test);

  docketClerkLogIn(test);
  docketClerkViewsSectionInboxHighPriority(test);
  docketClerkRemovesCaseFromTrial(test);
  docketClerkViewsSectionInboxNotHighPriority(test);
  userSignsOut(test);
});
