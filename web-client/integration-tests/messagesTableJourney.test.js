import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

describe('messages table journey', () => {
  const cerebralTest = setupTest();
  // const calendaredCaseDocketNumber = '103-20';

  beforeAll(() => {
    jest.setTimeout(40000);
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  //as docketclerk
  // docketClerkUpdatesCaseStatusToReadyForTrial

  // /as petitionsclerk
  //go to trial session detail, mark qc complete

  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  it('petitions clerk manually adds a case to a calendared trial session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openAddToTrialModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('caseDetail.trialDate')).toBeDefined();
  });

  createNewMessageOnCase(cerebralTest);

  it('petitions clerk views case trial information on sent messages view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === cerebralTest.docketNumber,
    );

    //add checks for trial info
    expect(foundMessage).toMatchObject({
      caseStatus: CASE_STATUS_TYPES.calendared,
      trialDate: '',
      trialLocation: '',
    });
  });
});
