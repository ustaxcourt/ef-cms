import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../shared/src/business/entities/EntityConstants';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { loginAs, setupTest } from './helpers';

const docketSectionMessage = 'To CSS under Docket Section';
const petitionsSectionMessage = 'To CSS under Petitions Section';
const seedCaseServicesSupervisorUserid = '35959d1a-0981-40b2-a93d-f65c7977db52';
const seededDocketNumber = '105-20';

describe('Case Services Supervisor Messages Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    docketNumber: seededDocketNumber,
    preserveCreatedMessage: false,
    subject: docketSectionMessage,
    toSection: DOCKET_SECTION,
    toUserId: seedCaseServicesSupervisorUserid,
  });

  createNewMessageOnCase(cerebralTest, {
    docketNumber: seededDocketNumber,
    preserveCreatedMessage: false,
    subject: petitionsSectionMessage,
    toSection: PETITIONS_SECTION,
    toUserId: seedCaseServicesSupervisorUserid,
  });

  loginAs(cerebralTest, 'caseservicessupervisor@example.com');
  it('case services supervisor views my messages inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessageToDocketSection = messages.find(
      message => message.subject === docketSectionMessage,
    );

    expect(foundMessageToDocketSection).toBeDefined();

    const foundMessageToPetitionsSection = messages.find(
      message => message.subject === petitionsSectionMessage,
    );

    expect(foundMessageToPetitionsSection).toBeDefined();
  });

  it('case services supervisor views docket section inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
      section: DOCKET_SECTION,
    });

    const messages = cerebralTest.getState('messages');

    const foundMessageToDocketSection = messages.find(
      message => message.subject === docketSectionMessage,
    );

    expect(foundMessageToDocketSection).toBeDefined();

    const foundMessageToPetitionsSection = messages.find(
      message => message.subject === petitionsSectionMessage,
    );

    expect(foundMessageToPetitionsSection).toBeUndefined();
  });

  it('case services supervisor views petitions section inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
      section: PETITIONS_SECTION,
    });

    const messages = cerebralTest.getState('messages');

    const foundMessageToPetitionsSection = messages.find(
      message => message.subject === petitionsSectionMessage,
    );

    expect(foundMessageToPetitionsSection).toBeDefined();

    const foundMessageToDocketSection = messages.find(
      message => message.subject === docketSectionMessage,
    );

    expect(foundMessageToDocketSection).toBeUndefined();
  });
});
