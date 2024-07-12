import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseInformationHelper as caseInformationHelperComputed } from './caseInformationHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import {
  mockAdcUser as mockAdc,
  mockDocketClerkUser as mockDocketClerk,
  mockJudgeUser as mockJudge,
  mockPetitionerUser as mockPetitioner,
  mockPetitionsClerkUser as mockPetitionsClerk,
  mockPrivatePractitionerUser as mockPrivatePractitioner,
} from '@shared/test/mockAuthUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseInformationHelper', () => {
  const caseInformationHelper = withAppContextDecorator(
    caseInformationHelperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      user,
    };
  };

  describe('formattedPetitioners', () => {
    let baseState;

    beforeEach(() => {
      baseState = {
        ...getBaseState(mockDocketClerk), // has SEAL_CASE permission
        caseDetail: {},
        form: {},
      };
    });

    it('should paginate and display only the first four petitioners when showingAdditionalPetitioners is false', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            petitioners: [
              { a: '1', contactType: CONTACT_TYPES.primary },
              { a: '1', contactType: CONTACT_TYPES.secondary },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
            ],
          },
          showingAdditionalPetitioners: false,
        },
      });

      expect(result.formattedPetitioners.length).toEqual(4);
    });

    it('should not paginate (displays all petitioners) when showingAdditionalPetitioners is true', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            petitioners: [
              { a: '1', contactType: CONTACT_TYPES.primary },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
            ],
          },
          showingAdditionalPetitioners: true,
        },
      });

      expect(result.formattedPetitioners.length).toEqual(7);
    });
  });

  describe('showAddCounsel', () => {
    it('should be false when the user is an external user', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPrivatePractitioner),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showAddCounsel).toEqual(false);
    });

    it('should be true when the user is an internal user with permissions to edit counsel', () => {
      let state = getBaseState(mockDocketClerk);
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      console.debug('********************', state);

      expect(result.showAddCounsel).toEqual(true);
    });

    it('should be true when the user is an internal user without permissions to edit counsel', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockAdc),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showAddCounsel).toEqual(false);
    });
  });

  describe('showAddPartyButton', () => {
    it('should be true when case status is not new and user has ADD_PETITIONER_TO_CASE permission', () => {
      const { showAddPartyButton } = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            petitioners: [],
            status: CASE_STATUS_TYPES.generalDocket,
          },
          form: {},
        },
      });

      expect(showAddPartyButton).toBeTruthy();
    });

    it('should be false when case status is new and user has ADD_PETITIONER_TO_CASE permission', () => {
      const { showAddPartyButton } = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            petitioners: [],
            status: CASE_STATUS_TYPES.new,
          },
          form: {},
        },
      });

      expect(showAddPartyButton).toBeFalsy();
    });

    it('should be false when case status is not new and user does not have ADD_PETITIONER_TO_CASE permission', () => {
      const { showAddPartyButton } = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitionsClerk),
          caseDetail: {
            petitioners: [],
            status: CASE_STATUS_TYPES.generalDocket,
          },
          form: {},
        },
      });

      expect(showAddPartyButton).toBeFalsy();
    });
  });

  describe('showEditIrsPractitionersButton', () => {
    it('should be true when the user is an internal user with permission to edit counsel and there are irsPractitioners on the case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showEditIrsPractitioners).toEqual(true);
    });

    it('should be false when the user is an internal user without permission to edit counsel and there are irsPractitioners on the case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockAdc),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showEditIrsPractitioners).toEqual(false);
    });

    it('should be false when the user is an internal user and there are no irsPractitioners on the case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showEditIrsPractitioners).toBeFalsy();
    });

    it('should be false when the user is not an internal user', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitioner),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showEditIrsPractitioners).toBeFalsy();
    });
  });

  describe('showViewCounselButton', () => {
    it('should be true when the user is an internal user who cannot edit counsel on a case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockJudge),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showViewCounselButton).toBeTruthy();
    });

    it('should be false when the user is an internal user who can edit counsel on a case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitionsClerk),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showViewCounselButton).toBeFalsy();
    });

    it('should be true when the user is an external user', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitioner),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showViewCounselButton).toBeTruthy();
    });
  });

  describe('showEditPrivatePractitionersButton', () => {
    [ROLES.docketClerk, ROLES.petitionsClerk, ROLES.admissionsClerk].forEach(
      role => {
        it('should be true when the user has permission to edit petitioner counsel and there are privatePractitioners on the case', () => {
          let mockUser = { ...mockDocketClerk, role };

          const result = runCompute(caseInformationHelper, {
            state: {
              ...getBaseState(mockUser),
              caseDetail: {
                irsPractitioners: [{ userId: '2' }],
                petitioners: [],
                privatePractitioners: [{ userId: '1' }],
              },
              form: {},
            },
          });

          expect(result.showEditPrivatePractitioners).toEqual(true);
        });
      },
    );

    it('should be false when the user is an internal user that does NOT have permission to edit petitioner counsel', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockAdc),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [{ userId: '1' }],
          },
          form: {},
        },
      });

      expect(result.showEditPrivatePractitioners).toEqual(false);
    });

    it('should be false when there are no privatePractitioners on the case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [{ userId: '2' }],
            petitioners: [],
            privatePractitioners: [],
          },
          form: {},
        },
      });

      expect(result.showEditPrivatePractitioners).toEqual(false);
    });
  });

  describe('showHearingsTable', () => {
    it('should be false when there are no hearings on the case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            hearings: [],
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showHearingsTable).toEqual(false);
    });

    it('should be true when there are hearings on the case', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            hearings: [{ trialSessionId: 'trial-id-123' }],
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showHearingsTable).toEqual(true);
    });
  });

  describe('showSealAddressLink', () => {
    it('should be true when the user is a docket clerk', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showSealAddressLink).toEqual(true);
    });

    it('should be false when the user is not a docket clerk', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitionsClerk),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showSealAddressLink).toEqual(false);
    });
  });

  describe('showSealCaseButton', () => {
    it('should be false when the user has SEAL_CASE permission and case is already sealed', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk), // has SEAL_CASE permission
          caseDetail: { isSealed: true, petitioners: [] },
          form: {},
        },
      });

      expect(result.showSealCaseButton).toEqual(false);
    });

    it('should be true when the user has SEAL_CASE permission and case is not already sealed', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk), // has SEAL_CASE permission
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showSealCaseButton).toEqual(true);
    });

    it('should be false when the user does not have SEAL_CASE permission', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitionsClerk), // does not have SEAL_CASE permission
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showSealCaseButton).toEqual(false);
    });
  });

  describe('toggleAdditionalPetitionersDisplay', () => {
    let baseState;

    beforeEach(() => {
      baseState = {
        ...getBaseState(mockDocketClerk), // has SEAL_CASE permission
        caseDetail: {},
        form: {},
      };
    });

    it('should be set to "Hide" when showingAdditionalPetitioners is true', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          showingAdditionalPetitioners: true,
        },
      });

      expect(result.toggleAdditionalPetitionersDisplay).toEqual('Hide');
    });

    it('should be set to "View" when showingAdditionalPetitioners is false', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            petitioners: [],
          },
          showingAdditionalPetitioners: false,
        },
      });

      expect(result.toggleAdditionalPetitionersDisplay).toEqual('View');
    });
  });

  describe('showEditCaseButton', () => {
    it('should set showEditCaseButton to true if the user has UPDATE_CASE_CONTENT permission', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: { docketEntries: [], petitioners: [] },
        },
      });
      expect(result.showEditCaseButton).toEqual(true);
    });

    it('should set showEditCaseButton to false if the user does not have UPDATE_CASE_CONTENT permission', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPrivatePractitioner),
          caseDetail: { docketEntries: [], petitioners: [] },
        },
      });
      expect(result.showEditCaseButton).toEqual(false);
    });
  });
});
