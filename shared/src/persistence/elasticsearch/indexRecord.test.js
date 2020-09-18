const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { indexRecord } = require('./indexRecord');

describe('indexRecord', () => {
  let record;

  beforeAll(() => {
    applicationContext.getSearchClient().index = jest.fn();

    record = {
      recordPk: 'record-pk-1',
      recordSk: 'record-sk-1',
    };
  });

  it('index record that has been marshalled', () => {
    const fullRecord = {
      entityName: {
        S: 'Case',
      },
      yee: {
        S: 'haw',
      },
    };

    indexRecord({
      applicationContext,
      fullRecord,
      isAlreadyMarshalled: true,
      record,
    });

    expect(
      applicationContext.getSearchClient().index.mock.calls[0][0],
    ).toMatchObject({
      body: { entityName: { S: 'Case' }, yee: { S: 'haw' } },
      id: 'record-pk-1_record-sk-1',
      index: 'efcms-case',
    });
  });

  it('index record that has not been marshalled', () => {
    const fullRecord = {
      entityName: 'Case',
      name: 'Guy Fieri',
      yee: 'haw',
    };

    indexRecord({
      applicationContext,
      fullRecord,
      isAlreadyMarshalled: false,
      record,
    });

    expect(
      applicationContext.getSearchClient().index.mock.calls[0][0],
    ).toMatchObject({
      body: {
        entityName: { S: 'Case' },
        name: { S: 'Guy Fieri' },
        yee: { S: 'haw' },
      },
      id: 'record-pk-1_record-sk-1',
      index: 'efcms-case',
    });
  });
});
