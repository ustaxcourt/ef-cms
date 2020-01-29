import { Document } from '../../../../shared/src/business/entities/Document';
import { applicationContext } from '../../applicationContext';
import { editDocketEntryMetaHelper as editDocketEntryMetaHelperComputed } from './editDocketEntryMetaHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const editDocketEntryMetaHelper = withAppContextDecorator(
  editDocketEntryMetaHelperComputed,
  {
    ...applicationContext,
  },
);

describe('editDocketEntryMetaHelper', () => {
  describe('docketEntryMetaFormComponent', () => {
    it('Should return CourtIssued in the case of a court issued document', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          form: {
            documentId: '123',
            eventCode: Document.COURT_ISSUED_EVENT_CODES[0].eventCode,
          },
        },
      });
      expect(result.docketEntryMetaFormComponent).toEqual('CourtIssued');
    });
    it('Should return Document in the case of a non court issued document', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          form: {
            documentId: '123',
          },
        },
      });
      expect(result.docketEntryMetaFormComponent).toEqual('Document');
    });
    it('Should return NoDocument when there is no document', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          form: {},
        },
      });
      expect(result.docketEntryMetaFormComponent).toEqual('NoDocument');
    });
  });

  describe('submitSequenceName', () => {});

  describe('validationSequenceName', () => {
    it('Should return validateDocketRecordSequence', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          form: {},
        },
      });
      expect(result.validationSequenceName).toEqual(
        'validateDocketRecordSequence',
      );
    });
  });
});
