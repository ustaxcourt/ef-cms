import {
  mockChambersUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { getQCInboxParameters } from './getQCInboxParameters';

describe('getQCInboxParameters', () => {
  it('should get query parameters for work items for a specific judge when the user is a chambers user', () => {
    const judgeId = '123456';
    const result = getQCInboxParameters({
      judgeId,
      section: 'colvinsChambers',
      selectedSection: undefined,
      user: mockChambersUser,
    });

    expect(result.judgeId).toEqual(judgeId);
    expect(result.section).toEqual(DOCKET_SECTION);
    expect(result.caseStatus).toBeUndefined();
  });

  it('should use selectedSection when provided', () => {
    const judgeId = '123456';
    const result = getQCInboxParameters({
      judgeId,
      section: 'colvinsChambers',
      selectedSection: PETITIONS_SECTION,
      user: mockChambersUser,
    });

    expect(result.judgeId).toEqual(judgeId);
    expect(result.section).toEqual(PETITIONS_SECTION);
  });

  it('should set judgeId to null when user is an ADC', () => {
    const judgeId = '123456';
    const adcUser = { ...mockChambersUser, role: ROLES.adc };

    const result = getQCInboxParameters({
      judgeId,
      section: 'colvinsChambers',
      selectedSection: undefined,
      user: adcUser,
    });

    expect(result.judgeId).toBeNull();
    expect(result.section).toEqual(DOCKET_SECTION);
  });

  it('should return DOCKET_SECTION when section is not PETITIONS_SECTION', () => {
    const judgeId = '123456';
    const result = getQCInboxParameters({
      judgeId,
      section: 'someOtherSection',
      selectedSection: undefined,
      user: mockChambersUser,
    });

    expect(result.judgeId).toEqual(judgeId);
    expect(result.section).toEqual(DOCKET_SECTION);
  });

  it('should return PETITIONS_SECTION when section is PETITIONS_SECTION', () => {
    const judgeId = '123456';
    const result = getQCInboxParameters({
      judgeId,
      section: PETITIONS_SECTION,
      selectedSection: undefined,
      user: mockChambersUser,
    });

    expect(result.judgeId).toEqual(judgeId);
    expect(result.section).toEqual(PETITIONS_SECTION);
  });

  it('should show only new case statuses when the section being displayed is PETITIONS_SECTION', () => {
    const result = getQCInboxParameters({
      section: PETITIONS_SECTION,
      user: mockPetitionsClerkUser,
    });

    expect(result.section).toEqual(PETITIONS_SECTION);
    expect(result.caseStatus).toEqual(CASE_STATUS_TYPES.new);
  });
});
