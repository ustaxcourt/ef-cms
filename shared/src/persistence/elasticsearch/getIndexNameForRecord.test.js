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

  it('returns efcms-docket-entry for CaseDocketEntryMapping records', () => {
    const record = {
      entityName: {
        S: 'CaseDocketEntryMapping',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-docket-entry');
  });

  it('returns efcms-message for CaseMessageMapping records', () => {
    const record = {
      entityName: {
        S: 'CaseMessageMapping',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-message');
  });

  it('returns efcms-user for User records', () => {
    const record = {
      entityName: {
        S: 'User',
      },
      pk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
      sk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-user');
  });

  it('should NOT return efcms-user when the record has a user entity name but the pk and sk are not "user"', () => {
    const record = {
      entityName: {
        S: 'IrsPractitioner',
      },
      pk: {
        S: 'case|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
      sk: {
        S: 'irsPractitioner|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(null);
  });

  it('returns efcms-user for Practitioner records', () => {
    const record = {
      entityName: {
        S: 'Practitioner',
      },
      pk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
      sk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
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
      pk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
      sk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
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
      pk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
      },
      sk: {
        S: 'user|fed0e453-a60d-4d23-a214-bfa905f72c85',
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

  it('returns efcms-case-deadline for CaseDeadline records', () => {
    const record = {
      entityName: {
        S: 'CaseDeadline',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-case-deadline');
  });

  it('returns efcms-case for unmarshalled Case record', () => {
    const record = {
      entityName: 'Case',
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-case');
  });

  it('returns efcms-work-item for WorkItem records', () => {
    const record = {
      entityName: 'WorkItem',
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual('efcms-work-item');
  });
});
