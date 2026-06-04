import {
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { shouldAllowMultiDocketing } from './shouldAllowMultiDocketing';

describe('shouldAllowMultiDocketing', () => {
  const baseDocketEntry = {
    filedByRole: ROLES.docketClerk,
    multiDocketedOn: [],
    eventCode: 'O',
  };

  it("should return true when isLead is true and the docket entry's event code is multidocketable and was not externally filed", () => {
    const result = shouldAllowMultiDocketing({
      docketEntry: baseDocketEntry,
      isLead: true,
    });

    expect(result).toEqual(true);
  });

  it("should return true when isLead is true and the docket entry's event code is multidocketable and it was already multidocketed", () => {
    const mockDocketEntry = {
      ...baseDocketEntry,
      filedByRole: ROLES.petitioner,
      multiDocketedOn: ['101-20', '102-20'],
    };

    const result = shouldAllowMultiDocketing({
      docketEntry: mockDocketEntry,
      isLead: true,
    });

    expect(result).toEqual(true);
  });

  it("should return false when the docket entry's event code is not multidocketable", () => {
    const mockDocketEntry = {
      ...baseDocketEntry,
      eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
    };

    const result = shouldAllowMultiDocketing({
      docketEntry: mockDocketEntry,
      isLead: true,
    });

    expect(result).toEqual(false);
  });

  it('should return false when the docket entry was externally filed and not multidocketed', () => {
    const mockDocketEntry = {
      ...baseDocketEntry,
      filedByRole: ROLES.petitioner,
      multiDocketedOn: [],
    };

    const result = shouldAllowMultiDocketing({
      docketEntry: mockDocketEntry,
      isLead: true,
    });

    expect(result).toEqual(false);
  });

  it('should return false when isLead is false', () => {
    const result = shouldAllowMultiDocketing({
      docketEntry: baseDocketEntry,
      isLead: false,
    });

    expect(result).toEqual(false);
  });
});
