import {
  courtIssuedDocketEntryOnChange,
  docketEntryOnChange,
  fileDocumentPrimaryOnChange,
  fileDocumentSecondaryOnChange,
  onInputChange,
  reactSelectValue,
} from './documentTypeSelectHelper';
import sinon from 'sinon';

describe('documentTypeSelectHelper', () => {
  let updateSequenceSpy, validateSequenceSpy;

  beforeEach(() => {
    updateSequenceSpy = sinon.spy();
    validateSequenceSpy = sinon.spy();
  });

  describe('fileDocumentPrimaryOnChange', () => {
    it('should call update sequence multiple times with correct props followed by validate sequence if "action" is "select-option"', () => {
      const inputValue = {
        category: 'Answer (filed by respondent only)',
        documentTitle: 'Amended Answer',
        documentType: 'Amended Answer',
        eventCode: 'AA',
        scenario: 'Standard',
      };

      fileDocumentPrimaryOnChange({
        action: 'select-option',
        inputValue,
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'category',
        value: inputValue.category,
      });
      expect(updateSequenceSpy.getCall(1).args[0]).toEqual({
        key: 'documentType',
        value: inputValue.documentType,
      });
      expect(updateSequenceSpy.getCall(2).args[0]).toEqual({
        key: 'documentTitle',
        value: inputValue.documentTitle,
      });
      expect(updateSequenceSpy.getCall(3).args[0]).toEqual({
        key: 'eventCode',
        value: inputValue.eventCode,
      });
      expect(updateSequenceSpy.getCall(4).args[0]).toEqual({
        key: 'scenario',
        value: inputValue.scenario,
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should call update sequence a single time followed by validate sequence if "action" is "clear"', () => {
      fileDocumentPrimaryOnChange({
        action: 'clear',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'category',
        value: '',
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      fileDocumentPrimaryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(false);
      expect(validateSequenceSpy.called).toEqual(false);
    });
  });

  describe('fileDocumentSecondaryOnChange', () => {
    it('should call update sequence multiple times with correct props followed by validate sequence if "action" is "select-option"', () => {
      const inputValue = {
        category: 'Answer (filed by respondent only)',
        documentTitle: 'Amended Answer',
        documentType: 'Amended Answer',
        eventCode: 'AA',
        scenario: 'Standard',
      };

      fileDocumentSecondaryOnChange({
        action: 'select-option',
        inputValue,
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'secondaryDocument.category',
        value: inputValue.category,
      });
      expect(updateSequenceSpy.getCall(1).args[0]).toEqual({
        key: 'secondaryDocument.documentType',
        value: inputValue.documentType,
      });
      expect(updateSequenceSpy.getCall(2).args[0]).toEqual({
        key: 'secondaryDocument.documentTitle',
        value: inputValue.documentTitle,
      });
      expect(updateSequenceSpy.getCall(3).args[0]).toEqual({
        key: 'secondaryDocument.eventCode',
        value: inputValue.eventCode,
      });
      expect(updateSequenceSpy.getCall(4).args[0]).toEqual({
        key: 'secondaryDocument.scenario',
        value: inputValue.scenario,
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should call update sequence a single time followed by validate sequence if "action" is "clear"', () => {
      fileDocumentSecondaryOnChange({
        action: 'clear',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'secondaryDocument.category',
        value: '',
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      fileDocumentSecondaryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(false);
      expect(validateSequenceSpy.called).toEqual(false);
    });
  });

  describe('docketEntryOnChange', () => {
    it('should call update sequence multiple times with correct props followed by validate sequence if "action" is "select-option"', () => {
      const inputValue = {
        value: 'AA',
      };

      docketEntryOnChange({
        action: 'select-option',
        inputValue,
        name: 'primaryDocument.eventCode',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'primaryDocument.eventCode',
        value: inputValue.value,
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should call update sequence a single time followed by validate sequence if "action" is "clear"', () => {
      docketEntryOnChange({
        action: 'clear',
        name: 'primaryDocument.eventCode',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'primaryDocument.eventCode',
        value: '',
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      docketEntryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(false);
      expect(validateSequenceSpy.called).toEqual(false);
    });
  });

  describe('courtIssuedDocketEntryOnChange', () => {
    it('should call update sequence multiple times with correct props followed by validate sequence if "action" is "select-option"', () => {
      const inputValue = {
        documentTitle: 'Order [Anything]',
        documentType: 'Order',
        eventCode: 'O',
        scenario: 'Type A',
      };

      courtIssuedDocketEntryOnChange({
        action: 'select-option',
        inputValue,
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'documentType',
        value: inputValue.documentType,
      });
      expect(updateSequenceSpy.getCall(1).args[0]).toEqual({
        key: 'documentTitle',
        value: inputValue.documentTitle,
      });
      expect(updateSequenceSpy.getCall(2).args[0]).toEqual({
        key: 'eventCode',
        value: inputValue.eventCode,
      });
      expect(updateSequenceSpy.getCall(3).args[0]).toEqual({
        key: 'scenario',
        value: inputValue.scenario,
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should call update sequence multiple times followed by validate sequence if "action" is "clear"', () => {
      courtIssuedDocketEntryOnChange({
        action: 'clear',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'documentType',
        value: '',
      });
      expect(updateSequenceSpy.getCall(1).args[0]).toEqual({
        key: 'documentTitle',
        value: '',
      });
      expect(updateSequenceSpy.getCall(2).args[0]).toEqual({
        key: 'eventCode',
        value: '',
      });
      expect(updateSequenceSpy.getCall(3).args[0]).toEqual({
        key: 'scenario',
        value: '',
      });
      expect(validateSequenceSpy.called).toEqual(true);
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      courtIssuedDocketEntryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(false);
      expect(validateSequenceSpy.called).toEqual(false);
    });
  });

  describe('onInputChange', () => {
    it('should call update sequence a single time if "action" is "input-change"', () => {
      onInputChange({
        action: 'input-change',
        inputText: 'something',
        updateSequence: updateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(true);
      expect(updateSequenceSpy.getCall(0).args[0]).toEqual({
        key: 'searchText',
        value: 'something',
      });
    });

    it('should not call update sequence if "action" is not "input-change"', () => {
      onInputChange({
        action: 'something-else',
        inputText: 'something',
        updateSequence: updateSequenceSpy,
      });

      expect(updateSequenceSpy.called).toEqual(false);
    });
  });

  describe('reactSelectValue', () => {
    const documentTypes = [
      {
        eventCode: 'AA',
        somethingElse: 1,
      },
      {
        eventCode: 'BB',
        somethingElse: 2,
      },
    ];

    it('should return the document type object matching the selected event code', () => {
      const result = reactSelectValue({
        documentTypes,
        selectedEventCode: 'AA',
      });

      expect(result).toEqual([documentTypes[0]]);
    });
  });
});
