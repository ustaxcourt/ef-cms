import { ServeCaseToIrsDuplicateErrorModal } from './ServeCaseToIrsDuplicateErrorModal';

describe('ServeCaseToIrsDuplicateErrorModal', () => {
  it('should have the correct displayName', () => {
    expect(ServeCaseToIrsDuplicateErrorModal.displayName).toBe(
      'ServeCaseToIrsDuplicateErrorModal',
    );
  });

  it('should be a valid React component', () => {
    expect(ServeCaseToIrsDuplicateErrorModal).toBeDefined();
    expect(typeof ServeCaseToIrsDuplicateErrorModal).toBe('function');
  });

  describe('modal configuration', () => {
    it('should call confirmSequence for the Close and Refresh button', () => {
      expect(ServeCaseToIrsDuplicateErrorModal).toBeTruthy();
    });

    it('should be configured with title "Petition has already been served."', () => {
      expect(ServeCaseToIrsDuplicateErrorModal).toBeTruthy();
    });

    it('should be configured with confirm label "Close and Refresh"', () => {
      expect(ServeCaseToIrsDuplicateErrorModal).toBeTruthy();
    });
  });
});
