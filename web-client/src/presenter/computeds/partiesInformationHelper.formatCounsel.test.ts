import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatCounsel } from './partiesInformationHelper';

describe('partiesInformationHelper', () => {
  const mockEmail = 'test@example.com';

  let mockIrsPractitioner;

  let mockUser;

  beforeEach(() => {
    mockUser = {};
    mockIrsPractitioner = {
      barNumber: 'RT1111',
      email: mockEmail,
      name: 'Test IRS',
      role: ROLES.irsPractitioner,
      userId: 'c6df4afc-286b-4979-92e2-b788e49dc51d',
    };
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  describe('formatCounsel', () => {
    it("should set formattedEmail to the counsel's email when it is defined and there is no pending email", () => {
      const result = formatCounsel({
        counsel: mockIrsPractitioner,
        screenMetadata: {},
      });

      expect(result.formattedEmail).toBe(mockEmail);
    });

    it('should set formattedEmail to `No email provided` when the respondent does not have an email or a pending email', () => {
      const result = formatCounsel({
        counsel: { ...mockIrsPractitioner, email: undefined },
        screenMetadata: { pendingEmails: {} },
      });

      expect(result.formattedEmail).toBe('No email provided');
    });

    it('should set formattedEmail to undefined, and set formattedPending email when the respondent does not have an email but has a pending email', () => {
      const result = formatCounsel({
        counsel: { ...mockIrsPractitioner, email: undefined },
        screenMetadata: {
          pendingEmails: {
            [mockIrsPractitioner.userId]: mockEmail,
          },
        },
      });

      expect(result.formattedEmail).toBeUndefined();
      expect(result.formattedPendingEmail).toBe(`${mockEmail} (Pending)`);
    });

    it('should set formattedPendingEmail when the respondent has a pending email and formattedEmail to email when it is defined', () => {
      const result = formatCounsel({
        counsel: { ...mockIrsPractitioner, email: 'lalal@example' },
        screenMetadata: {
          pendingEmails: {
            [mockIrsPractitioner.userId]: mockEmail,
          },
        },
      });

      expect(result.formattedPendingEmail).toBe(`${mockEmail} (Pending)`);
      expect(result.formattedEmail).toBe('lalal@example');
    });

    it('should set formattedPendingEmail when the respondent has a pending email and formattedEmail to undefined when it is the same as the pending email', () => {
      const result = formatCounsel({
        counsel: { ...mockIrsPractitioner, email: mockEmail },
        screenMetadata: {
          pendingEmails: {
            [mockIrsPractitioner.userId]: mockEmail,
          },
        },
      });

      expect(result.formattedPendingEmail).toBe(`${mockEmail} (Pending)`);
      expect(result.formattedEmail).toBeUndefined();
    });

    it('should not set formattedPendingEmail when the respondent has no pending email', () => {
      const result = formatCounsel({
        counsel: mockIrsPractitioner,
        screenMetadata: {
          pendingEmails: {
            [mockIrsPractitioner.userId]: undefined,
          },
        },
      });

      expect(result.formattedPendingEmail).toBeUndefined();
    });

    it('should not set formattedPendingEmail when screenMetadata.pendingEmails is undefined', () => {
      const result = formatCounsel({
        counsel: mockIrsPractitioner,
        screenMetadata: { pendingEmails: {} },
      });

      expect(result.formattedPendingEmail).toBeUndefined();
    });
  });
});
