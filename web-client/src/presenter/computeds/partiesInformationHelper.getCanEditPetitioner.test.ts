import {
  CONTACT_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  docketClerkUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { getCanEditPetitioner } from './partiesInformationHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';

describe('partiesInformationHelper canEditPetitioner', () => {
  let mockPetitioner;

  const getBaseParams = user => {
    mockUser = { ...user };
    return {
      applicationContext,
      permissions: getUserPermissions(user),
      user: mockUser,
    };
  };

  let mockUser;

  beforeEach(() => {
    mockUser = {};
    mockPetitioner = {
      contactId: 'f94cef8e-17b8-4504-9296-af911b32020a',
      contactType: CONTACT_TYPES.primary,
      role: ROLES.petitioner,
      userId: 'f94cef8e-17b8-4504-9296-af911b32020a',
    };
  });

  it('is false when the petition has not been served', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(docketClerkUser),
      petitionIsServed: false,
      petitioner: mockPetitioner,
      userAssociatedWithCase: false,
    });

    expect(result).toBe(false);
  });

  it('is true when the user is an internal user with permission to edit petitioner info and the petition has been served', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(docketClerkUser),
      petitionIsServed: true,
      petitioner: mockPetitioner,
      userAssociatedWithCase: false,
    });

    expect(result).toBe(true);
  });

  it('is false when the user is an internal user without permission to edit petitioner info', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(petitionsClerkUser),
      petitionIsServed: true,
      petitioner: mockPetitioner,
      userAssociatedWithCase: false,
    });

    expect(result).toBe(false);
  });

  it('is true when the user is the corresponding petitioner and the petition has been served', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(mockPetitioner),
      petitionIsServed: true,
      petitioner: mockPetitioner,
      userAssociatedWithCase: true,
    });

    expect(result).toBe(true);
  });

  it('is false when the user is not the corresponding petitioner and the petition has been served', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(mockPetitioner),
      petitionIsServed: true,
      petitioner: {
        ...mockPetitioner,
        contactId: '38eb11a1-53be-4a5d-967c-b7334ddfd82f',
      },
      userAssociatedWithCase: false,
    });

    expect(result).toBeFalsy();
  });

  it('is true when the current user is a private practitioner associated with the case and the petition has been served', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(privatePractitionerUser),
      petitionIsServed: true,
      petitioner: mockPetitioner,
      userAssociatedWithCase: true,
    });

    expect(result).toBeTruthy();
  });

  it('is false when the current user is a private practitioner not associated with the case and the petition has been served', () => {
    const result = getCanEditPetitioner({
      ...getBaseParams(privatePractitionerUser),
      petitionIsServed: true,
      petitioner: mockPetitioner,
      userAssociatedWithCase: false,
    });

    expect(result).toBeFalsy();
  });
});
