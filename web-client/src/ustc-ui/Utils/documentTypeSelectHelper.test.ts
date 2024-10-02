import { onInputChange, reactSelectValue } from './documentTypeSelectHelper';

describe('documentTypeSelectHelper', () => {
  let updateSequenceSpy;

  beforeEach(() => {
    updateSequenceSpy = jest.fn();
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
});
