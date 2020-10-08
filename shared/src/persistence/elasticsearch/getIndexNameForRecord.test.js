const { getIndexNameForRecord } = require('./getIndexNameForRecord');

describe('getIndexNameForRecord', () => {
  it('returns null as a default', () => {
    let record, result;

    record = undefined;
    result = getIndexNameForRecord(record);
    expect(result).toEqual(null);

    record = {};
    result = getIndexNameForRecord(record);
    expect(result).toEqual(null);
  });

  it('returns efcms-case for Case records', () => {
    const record = {
      entityName: {
        S: 'Case',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-case');
  });

  it('returns efcms-docket-entry for DocketEntry records', () => {
    const record = {
      entityName: {
        S: 'DocketEntry',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-docket-entry');
  });

  it('returns efcms-user for User records', () => {
    const record = {
      entityName: {
        S: 'User',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-user');
  });

  it('returns efcms-user for Practitioner records', () => {
    const record = {
      entityName: {
        S: 'Practitioner',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-user');
  });

  it('returns efcms-user for PrivatePractitioner records', () => {
    const record = {
      entityName: {
        S: 'PrivatePractitioner',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-user');
  });

  it('returns efcms-user for IrsPractitioner records', () => {
    const record = {
      entityName: {
        S: 'IrsPractitioner',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-user');
  });

  it('returns efcms-message for Message records', () => {
    const record = {
      entityName: {
        S: 'Message',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-message');
  });

  it('returns efcms-user-case for UserCase records', () => {
    const record = {
      entityName: {
        S: 'UserCase',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-user-case');
  });

  it('returns efcms-case for unmarshalled Case record', () => {
    const record = {
      entityName: 'Case',
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-case');
  });
});
