import { efcmsCaseDeadlineIndex } from '../../../elasticsearch/efcms-case-deadline-mappings';
import { efcmsCaseIndex } from '../../../elasticsearch/efcms-case-mappings';
import { efcmsDocketEntryIndex } from '../../../elasticsearch/efcms-docket-entry-mappings';
import { efcmsMessageIndex } from '../../../elasticsearch/efcms-message-mappings';
import { efcmsUserIndex } from '../../../elasticsearch/efcms-user-mappings';
import { efcmsWorkItemIndex } from '../../../elasticsearch/efcms-work-item-mappings';
import { isObject, isString } from 'lodash';

const userEntityNames = [
  'User',
  'PrivatePractitioner',
  'IrsPractitioner',
  'Practitioner',
];

const isRecordOfType = (record, type) => {
  let entityName;

  if (record && record.entityName && isString(record.entityName)) {
    ({ entityName } = record);
  } else if (record && isObject(record.entityName)) {
    entityName = record.entityName.S;
  }

  if (entityName) {
    if (
      type === 'User' &&
      userEntityNames.includes(entityName) &&
      record.pk.S.startsWith('user|') &&
      record.sk.S.startsWith('user|')
    ) {
      return true;
    }

    if (type == 'DocketEntry' && entityName === 'CaseDocketEntryMapping') {
      return true;
    }

    if (type == 'Message' && entityName === 'CaseMessageMapping') {
      return true;
    }

    if (type == 'WorkItem' && entityName === 'CaseWorkItemMapping') {
      return true;
    }

    if (entityName === type) {
      return true;
    }
  }
};

/**
 * getIndexNameForRecord
 *
 * @param {object} record the record object
 * @returns {object} the index the record belongs to
 */
export const getIndexNameForRecord = record => {
  let index: string = '';

  if (isRecordOfType(record, 'Case')) {
    index = efcmsCaseIndex;
  } else if (isRecordOfType(record, 'DocketEntry')) {
    index = efcmsDocketEntryIndex;
  } else if (isRecordOfType(record, 'User')) {
    index = efcmsUserIndex;
  } else if (isRecordOfType(record, 'Message')) {
    index = efcmsMessageIndex;
  } else if (isRecordOfType(record, 'CaseDeadline')) {
    index = efcmsCaseDeadlineIndex;
  } else if (isRecordOfType(record, 'WorkItem')) {
    index = efcmsWorkItemIndex;
  }

  return index;
};
