import {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { GENERATION_TYPES } from '@web-client/getConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { capitalize } from 'lodash';
import { caseAssociationRequestHelper as caseAssociationRequestHelperComputed } from './caseAssociationRequestHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseAssociationRequestHelper', () => {
  const mockContactId1 = '4e53fade-4966-4efe-8b01-0cb5f587eb47';
  const mockContactId2 = '68a1e378-6e96-4e61-b06e-2cb4e6c22f48';
  const mockContactId3 = '00a770ee-eb7a-45df-a1ff-df1c01b9d756';

  const state = {
    caseDetail: MOCK_CASE,
    form: {} as any,
    validationErrors: {},
  };

  const caseAssociationRequestHelper = withAppContextDecorator(
    caseAssociationRequestHelperComputed,
    applicationContext,
  );

  const filersMap = {
    [mockContactId1]: true,
    [mockContactId2]: false,
    [mockContactId3]: true,
  };

  beforeEach(() => {
    applicationContext.getCurrentUser = () =>
      ({
        role: ROLES.privatePractitioner,
      }) as RawUser;

    state.form = {
      filersMap,
    };

    const TEST_PETITIONERS = [
      {
        contactId: mockContactId1,
        name: 'bob',
      },
      {
        contactId: mockContactId2,
        name: 'sally',
      },
      {
        contactId: mockContactId3,
        name: 'rick',
      },
    ];

    state.caseDetail = {
      petitioners: TEST_PETITIONERS,
    } as RawCase;
  });

  it('returns correct values when documentType is undefined', () => {
    let testState = {
      ...state,
      form: { documentType: undefined, filersMap: {} },
    };

    const expected = {
      showPrimaryDocumentValid: false,
    };

    const result = runCompute(caseAssociationRequestHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
  });

  it('indicates file uploads are valid', () => {
    state.form = {
      documentType: 'Entry of Appearance',
      filersMap,
      primaryDocumentFile: { some: 'file' },
    };

    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('generates correctly formatted service date', () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', () => {
    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('');
  });

  it('returns correct number of document options for user role privatePractitioner', () => {
    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.documents.length).toEqual(7);
  });

  it('returns correct number of document options for user role irsPractitioner', () => {
    applicationContext.getCurrentUser = () =>
      ({
        role: ROLES.irsPractitioner,
      }) as RawUser;
    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.documents.length).toEqual(2);
  });

  it('shows filing includes if certificate of service or attachments is true', () => {
    state.form = { certificateOfService: true, filersMap };
    let result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);

    state.form = {
      attachments: true,
      certificateOfService: false,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);
  });

  it('does not show filing includes if certificate of service and attachments are false', () => {
    state.form = {
      attachments: false,
      certificateOfService: false,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingIncludes).toEqual(false);
  });

  it('shows filing not includes if certificate of service, attachments, or supporting documents is false', () => {
    state.form = { certificateOfService: false, filersMap };
    let result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      certificateOfService: true,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      attachments: false,
      certificateOfService: true,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      attachments: true,
      certificateOfService: true,
      documentType: 'Motion to Substitute Parties and Change Caption',
      filersMap,
      hasSupportingDocuments: false,
    };
    result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);
  });

  it('does not show filing not includes if certificate of service, attachments, and supporting documents are true', () => {
    state.form = {
      attachments: true,
      certificateOfService: true,
      documentType: 'Motion to Substitute Parties and Change Caption',
      filersMap,
      hasSupportingDocuments: true,
    };
    const result = runCompute(caseAssociationRequestHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(false);
  });

  describe('isAutoGeneratedEntryOfAppearance', () => {
    it('should set to true if event code is EA and auto generation type', () => {
      state.form = {
        eventCode: 'EA',
        generationType: GENERATION_TYPES.AUTO,
      };
      const { isAutoGeneratedEntryOfAppearance } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );

      expect(isAutoGeneratedEntryOfAppearance).toEqual(true);
    });

    it('should set to false if event code is not EA and auto generation type', () => {
      state.form = {
        eventCode: 'A',
        generationType: GENERATION_TYPES.AUTO,
      };
      const { isAutoGeneratedEntryOfAppearance } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );

      expect(isAutoGeneratedEntryOfAppearance).toEqual(false);
    });

    it('should set to false if event code is EA and manual generation type', () => {
      state.form = {
        eventCode: 'EA',
        generationType: GENERATION_TYPES.MANUAL,
      };
      const { isAutoGeneratedEntryOfAppearance } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );

      expect(isAutoGeneratedEntryOfAppearance).toEqual(false);
    });
  });

  describe('showGenerationTypeForm', () => {
    beforeEach(() => {
      state.form = {
        eventCode: 'EA',
      };

      const TEST_PETITIONERS = [
        {
          contactId: mockContactId1,
          contactType: CONTACT_TYPES.primary,
          name: 'bob',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        {
          contactId: mockContactId2,
          contactType: CONTACT_TYPES.primary,
          name: 'sally',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ];

      state.caseDetail = {
        petitioners: TEST_PETITIONERS,
      } as RawCase;
    });

    it('should set showGenerationTypeForm to true when code is EA and no petitioner has paper and user is a irsPractitioner', () => {
      const TEST_PETITIONERS = [
        {
          contactId: mockContactId1,
          contactType: CONTACT_TYPES.primary,
          name: 'bob',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        {
          contactId: mockContactId2,
          contactType: CONTACT_TYPES.primary,
          name: 'sally',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ];
      state.caseDetail = {
        petitioners: TEST_PETITIONERS,
      } as RawCase;

      applicationContext.getCurrentUser = () =>
        ({
          role: ROLES.irsPractitioner,
        }) as RawUser;
      const { showGenerationTypeForm } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );
      expect(showGenerationTypeForm).toBeTruthy();
    });

    it('should set showGenerationTypeForm to false when code is O and any petitioner has paper and user is a private practitioner', () => {
      state.form = {
        eventCode: 'O',
      };
      applicationContext.getCurrentUser = () =>
        ({
          role: ROLES.privatePractitioner,
        }) as RawUser;
      const { showGenerationTypeForm } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );
      expect(showGenerationTypeForm).toBeFalsy();
    });

    it('should set showGenerationTypeForm to false when code is EA and any petitioner has paper and user is not a private practitioner', () => {
      applicationContext.getCurrentUser = () =>
        ({
          role: ROLES.irsPractitioner,
        }) as RawUser;
      const { showGenerationTypeForm } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );
      expect(showGenerationTypeForm).toBeFalsy();
    });

    it('should set showGenerationTypeForm to true when code is EA and user is a private practitioner with parties that have paper service', () => {
      const { showGenerationTypeForm } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );

      expect(showGenerationTypeForm).toBeTruthy();
    });
  });

  describe('representingPartiesNames', () => {
    beforeEach(() => {
      state.form = {
        filersMap: {
          [mockContactId1]: true,
          [mockContactId2]: false,
          [mockContactId3]: true,
        },
      };

      state.caseDetail = {
        petitioners: [
          {
            contactId: mockContactId1,
            contactType: CONTACT_TYPES.primary,
            name: 'bob',
          },
          {
            contactId: mockContactId2,
            contactType: CONTACT_TYPES.secondary,
            name: 'sally',
          },
          {
            contactId: mockContactId3,
            contactType: CONTACT_TYPES.participant,
            name: 'rick',
          },
        ],
      } as RawCase;
    });

    it('should be set to the names of all petitioners being represented', () => {
      const { representingPartiesNames } = runCompute(
        caseAssociationRequestHelper,
        {
          state,
        },
      );

      expect(representingPartiesNames).toEqual([
        'bob, Petitioner',
        `rick, ${capitalize(CONTACT_TYPES.participant)}`,
      ]);
    });
  });
});
