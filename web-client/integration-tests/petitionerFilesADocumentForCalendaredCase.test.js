import { fakeFile, setupTest, uploadPetition } from './helpers';

import calendarClerkLogIn from './journey/calendarClerkLogIn';
import calendarClerkSetsATrialSessionsSchedule from './journey/calendarClerkSetsATrialSessionsSchedule';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkRemovesCaseFromTrial from './journey/docketClerkRemovesCaseFromTrial';
import docketClerkViewsSectionInboxHighPriority from './journey/docketClerkViewsSectionInboxHighPriority';
import docketClerkViewsSectionInboxNotHighPriority from './journey/docketClerkViewsSectionInboxNotHighPriority';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionerFilesDocumentForCase from './journey/petitionerFilesDocumentForCase';
import petitionerLogIn from './journey/petitionerLogIn';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('petitioner files document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
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

  calendarClerkLogIn(test);
  calendarClerkSetsATrialSessionsSchedule(test);
  userSignsOut(test);

  petitionsClerkLogIn(test);
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
