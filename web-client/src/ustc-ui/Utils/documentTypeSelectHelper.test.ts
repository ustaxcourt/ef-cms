import { reactSelectValue } from './documentTypeSelectHelper';

describe('documentTypeSelectHelper', () => {
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
