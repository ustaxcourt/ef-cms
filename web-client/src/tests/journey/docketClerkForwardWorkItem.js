import _ from 'lodash';

export default test => {
  return it('Docket clerk forward work item', async () => {
    test.setState('form', {
      forwardRecipientId: 'seniorattorney',
      forwardMessage: 'hello world',
    });
    await test.runSequence('submitForwardSequence', {
      workItemId: test.workItemId,
    });
    const caseDetail = test.getState('caseDetail');
    let workItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === test.workItemId) {
          workItem = item;
        }
      }),
    );
    expect(workItem).toMatchObject({
      assigneeId: 'seniorattorney',
      assigneeName: 'Senior Attorney',
    });
    const messages = _.orderBy(workItem.messages, 'createdAt', 'desc');
    expect(messages.length).toEqual(2);
    expect(messages[0]).toMatchObject({
      message: 'hello world',
      userId: 'docketclerk',
      sentBy: 'Docket Clerk',
    });
  });
};
