import {
  courtIssuedDocketEntryOnChange,
  docketEntryOnChange,
  fileDocumentPrimaryOnChange,
  fileDocumentSecondaryOnChange,
  irsCalendarAdminInfoOnChange,
  onInputChange,
  reactSelectValue,
} from './documentTypeSelectHelper';

describe('documentTypeSelectHelper', () => {
  let updateSequenceSpy, validateSequenceSpy;

  beforeEach(() => {
    updateSequenceSpy = jest.fn();
    validateSequenceSpy = jest.fn();
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

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'category',
        value: inputValue.category,
      });
      expect(updateSequenceSpy.mock.calls[1][0]).toEqual({
        key: 'documentType',
        value: inputValue.documentType,
      });
      expect(updateSequenceSpy.mock.calls[2][0]).toEqual({
        key: 'documentTitle',
        value: inputValue.documentTitle,
      });
      expect(updateSequenceSpy.mock.calls[3][0]).toEqual({
        key: 'eventCode',
        value: inputValue.eventCode,
      });
      expect(updateSequenceSpy.mock.calls[4][0]).toEqual({
        key: 'scenario',
        value: inputValue.scenario,
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should call update sequence a single time followed by validate sequence if "action" is "clear"', () => {
      fileDocumentPrimaryOnChange({
        action: 'clear',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'category',
        value: '',
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      fileDocumentPrimaryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).not.toHaveBeenCalled();
      expect(validateSequenceSpy).not.toHaveBeenCalled();
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

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'secondaryDocument.category',
        value: inputValue.category,
      });
      expect(updateSequenceSpy.mock.calls[1][0]).toEqual({
        key: 'secondaryDocument.documentType',
        value: inputValue.documentType,
      });
      expect(updateSequenceSpy.mock.calls[2][0]).toEqual({
        key: 'secondaryDocument.documentTitle',
        value: inputValue.documentTitle,
      });
      expect(updateSequenceSpy.mock.calls[3][0]).toEqual({
        key: 'secondaryDocument.eventCode',
        value: inputValue.eventCode,
      });
      expect(updateSequenceSpy.mock.calls[4][0]).toEqual({
        key: 'secondaryDocument.scenario',
        value: inputValue.scenario,
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should call update sequence a single time followed by validate sequence if "action" is "clear"', () => {
      fileDocumentSecondaryOnChange({
        action: 'clear',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'secondaryDocument.category',
        value: '',
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      fileDocumentSecondaryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).not.toHaveBeenCalled();
      expect(validateSequenceSpy).not.toHaveBeenCalled();
    });
  });

  describe('docketEntryOnChange', () => {
    it('should call update sequence multiple times with correct props followed by validate sequence if "action" is "select-option"', () => {
      const inputValue = {
        value: 'AA',
      };

      docketEntryOnChange({
        action: 'select-option',
        inputName: 'primaryDocument.eventCode',
        inputValue,
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'primaryDocument.eventCode',
        value: inputValue.value,
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should call update sequence a single time followed by validate sequence if "action" is "clear"', () => {
      docketEntryOnChange({
        action: 'clear',
        inputName: 'primaryDocument.eventCode',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'primaryDocument.eventCode',
        value: '',
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      docketEntryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).not.toHaveBeenCalled();
      expect(validateSequenceSpy).not.toHaveBeenCalled();
    });
  });

  describe('courtIssuedDocketEntryOnChange', () => {
    it('should call update sequence multiple times with correct props followed by validate sequence if "action" is "select-option"', () => {
      const inputValue = {
        documentTitle: '[Anything]',
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

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'documentType',
        value: inputValue.documentType,
      });
      expect(updateSequenceSpy.mock.calls[1][0]).toEqual({
        key: 'documentTitle',
        value: inputValue.documentTitle,
      });
      expect(updateSequenceSpy.mock.calls[2][0]).toEqual({
        key: 'eventCode',
        value: inputValue.eventCode,
      });
      expect(updateSequenceSpy.mock.calls[3][0]).toEqual({
        key: 'scenario',
        value: inputValue.scenario,
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should call update sequence multiple times followed by validate sequence if "action" is "clear"', () => {
      courtIssuedDocketEntryOnChange({
        action: 'clear',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
        key: 'documentType',
        value: '',
      });
      expect(updateSequenceSpy.mock.calls[1][0]).toEqual({
        key: 'documentTitle',
        value: '',
      });
      expect(updateSequenceSpy.mock.calls[2][0]).toEqual({
        key: 'eventCode',
        value: '',
      });
      expect(updateSequenceSpy.mock.calls[3][0]).toEqual({
        key: 'scenario',
        value: '',
      });
      expect(validateSequenceSpy).toHaveBeenCalled();
    });

    it('should not call update or validate sequence if "action" is not "select-option" or "clear"', () => {
      courtIssuedDocketEntryOnChange({
        action: 'something-else',
        updateSequence: updateSequenceSpy,
        validateSequence: validateSequenceSpy,
      });

      expect(updateSequenceSpy).not.toHaveBeenCalled();
      expect(validateSequenceSpy).not.toHaveBeenCalled();
    });
  });

  describe('onInputChange', () => {
    it('should call update sequence a single time if "action" is "input-change"', () => {
      onInputChange({
        action: 'input-change',
        inputText: 'something',
        updateSequence: updateSequenceSpy,
      });

      expect(updateSequenceSpy).toHaveBeenCalled();
      expect(updateSequenceSpy.mock.calls[0][0]).toEqual({
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

      expect(updateSequenceSpy).not.toHaveBeenCalled();
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

  describe('irsCalendarAdminInfoOnChange', () => {
    it('should call updateTrialSessionFormDataSequence for all properies for contactInfo when action is "select-option"', () => {
      const action = 'select-option';
      const inputValue = {
        email: 'TEST_EMAIL',
        name: 'TEST_NAME',
        phone: 'TEST_PHONE',
      };
      const updateTrialSessionFormDataSequence = jest.fn();

      irsCalendarAdminInfoOnChange({
        action,
        inputValue,
        updateTrialSessionFormDataSequence,
      });

      const { calls } = updateTrialSessionFormDataSequence.mock;
      expect(calls.length).toEqual(3);
      const [nameCall, emailCall, phoneCall] = calls;
      expect(nameCall[0]).toEqual({
        key: 'irsCalendarAdministratorInfo.name',
        value: 'TEST_NAME',
      });

      expect(emailCall[0]).toEqual({
        key: 'irsCalendarAdministratorInfo.email',
        value: 'TEST_EMAIL',
      });

      expect(phoneCall[0]).toEqual({
        key: 'irsCalendarAdministratorInfo.phone',
        value: 'TEST_PHONE',
      });
    });

    it('should call updateTrialSessionFormDataSequence to clear contactInfo when action is "clear"', () => {
      const action = 'clear';
      const inputValue = {
        email: 'TEST_EMAIL',
        name: 'TEST_NAME',
        phone: 'TEST_PHONE',
      };
      const updateTrialSessionFormDataSequence = jest.fn();

      irsCalendarAdminInfoOnChange({
        action,
        inputValue,
        updateTrialSessionFormDataSequence,
      });

      const { calls } = updateTrialSessionFormDataSequence.mock;
      expect(calls.length).toEqual(1);
      expect(calls[0][0]).toEqual({
        key: 'irsCalendarAdministratorInfo',
        value: {},
      });
    });
  });
});
