import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { setPriorityOnAllWorkItems } from './setPriorityOnAllWorkItems';

describe('setPriorityOnAllWorkItems', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().update.mockResolvedValue(true);

    applicationContext.getDocumentClient().query.mockResolvedValue({
      Items: [
        {
          pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
          sk: '62685fab-04f3-43d2-b34d-cf1b1b38f300',
        },
        {
          pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
          sk: 'a5b0c565-cf78-4047-8bbc-c16cfee3062b',
        },
      ],
    });
  });

  it('invokes the persistence layer to update each work item', async () => {
    await setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: '101-20',
      highPriority: true,
      trialDate: '2019-03-01T21:40:46.415Z',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': true,
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: '62685fab-04f3-43d2-b34d-cf1b1b38f300',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[1][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': true,
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: 'a5b0c565-cf78-4047-8bbc-c16cfee3062b',
      },
    });
  });

  it('invokes the persistence layer to update each work item with an undefined trialDate', async () => {
    await setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: '101-20',
      highPriority: false,
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': false,
        ':trialDate': null,
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: '62685fab-04f3-43d2-b34d-cf1b1b38f300',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[1][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': false,
        ':trialDate': null,
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: 'a5b0c565-cf78-4047-8bbc-c16cfee3062b',
      },
    });
  });
});
