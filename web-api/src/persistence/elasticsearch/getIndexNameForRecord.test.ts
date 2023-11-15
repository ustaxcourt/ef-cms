import { efcmsCaseDeadlineIndex } from '../../../elasticsearch/efcms-case-deadline-mappings';
import { efcmsCaseIndex } from '../../../elasticsearch/efcms-case-mappings';
import { efcmsDocketEntryIndex } from '../../../elasticsearch/efcms-docket-entry-mappings';
import { efcmsMessageIndex } from '../../../elasticsearch/efcms-message-mappings';
import { efcmsUserIndex } from '../../../elasticsearch/efcms-user-mappings';
import { efcmsWorkItemIndex } from '../../../elasticsearch/efcms-work-item-mappings';
import { getIndexNameForRecord } from './getIndexNameForRecord';

describe('getIndexNameForRecord', () => {
  it('returns null as a default', () => {
    let record, result;

    record = undefined;
    result = getIndexNameForRecord(record);
    expect(result).toEqual('');

    record = {};
    result = getIndexNameForRecord(record);
    expect(result).toEqual('');
  });

  it('returns efcms-case for Case records', () => {
    const record = {
      entityName: {
        S: 'Case',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsCaseIndex);
  });

  it('returns efcms-docket-entry for DocketEntry records', () => {
    const record = {
      entityName: {
        S: 'DocketEntry',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsDocketEntryIndex);
  });

  it('returns efcms-docket-entry for CaseDocketEntryMapping records', () => {
    const record = {
      entityName: {
        S: 'CaseDocketEntryMapping',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsDocketEntryIndex);
  });

  it('returns efcms-message for CaseMessageMapping records', () => {
    const record = {
      entityName: {
        S: 'CaseMessageMapping',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsMessageIndex);
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

    expect(result).toEqual(efcmsUserIndex);
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

    expect(result).toEqual('');
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

    expect(result).toEqual(efcmsUserIndex);
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

    expect(result).toEqual(efcmsUserIndex);
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

    expect(result).toEqual(efcmsUserIndex);
  });

  it('returns efcms-message for Message records', () => {
    const record = {
      entityName: {
        S: 'Message',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsMessageIndex);
  });

  it('returns efcms-case-deadline for CaseDeadline records', () => {
    const record = {
      entityName: {
        S: 'CaseDeadline',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsCaseDeadlineIndex);
  });

  it('returns efcms-case for unmarshalled Case record', () => {
    const record = {
      entityName: 'Case',
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsCaseIndex);
  });

  it('returns efcms-work-item for WorkItem records', () => {
    const record = {
      entityName: 'WorkItem',
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsWorkItemIndex);
  });

  it('returns efcms-work-item for CaseWorkItemMapping records', () => {
    const record = {
      entityName: {
        S: 'CaseWorkItemMapping',
      },
    };

    const result = getIndexNameForRecord(record);

    expect(result).toEqual(efcmsWorkItemIndex);
  });
});
