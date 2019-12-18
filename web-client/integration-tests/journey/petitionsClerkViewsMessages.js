import { Case } from '../../../shared/src/business/entities/cases/Case';

export default test => {
  return it('Petitions clerk views messages', async () => {
    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    expect(test.getState('workQueue').length).toBeGreaterThanOrEqual(0);
    expect(test.getState('users').length).toBeGreaterThan(0);
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });
    const workItem = test
      .getState('workQueue')
      .find(
        workItem =>
          workItem.docketNumber === test.docketNumber &&
          workItem.document.documentType === 'Petition',
      );
    expect(workItem).toBeDefined();
    expect(workItem.caseStatus).toEqual(Case.STATUS_TYPES.new);
    expect(workItem.messages[0].message).toEqual(
      'Petition filed by Test Person, Deceased, Test Person 2, Surviving Spouse is ready for review.',
    );
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
  });
};
