import { IrsCalendarAdministratorInfo } from '@shared/business/entities/trialSessions/IrsCalendarAdministratorInfo';

describe('IrsCalendarAdministratorInfo', () => {
  const VALID_DATA = {
    email: 'TEST_EMAIL',
    name: 'TEST_NAME',
    phone: 'TEST_PHONE',
  };

  it('should initialize the entity with no errors', () => {
    const entity = new IrsCalendarAdministratorInfo(VALID_DATA);
    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  describe('getFormattedValidationErrors', () => {
    it('should return an error message for name when it exceeds the max length', () => {
      const entity = new IrsCalendarAdministratorInfo({
        ...VALID_DATA,
        name: '1'.repeat(101),
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        name: '"name" length must be less than or equal to 100 characters long',
      });
    });

    it('should return an error message for email when it exceeds the max length', () => {
      const entity = new IrsCalendarAdministratorInfo({
        ...VALID_DATA,
        email: '1'.repeat(101),
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        email:
          '"email" length must be less than or equal to 100 characters long',
      });
    });

    it('should return an error message for phone when it exceeds the max length', () => {
      const entity = new IrsCalendarAdministratorInfo({
        ...VALID_DATA,
        phone: '1'.repeat(101),
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        phone:
          '"phone" length must be less than or equal to 100 characters long',
      });
    });
  });
});
