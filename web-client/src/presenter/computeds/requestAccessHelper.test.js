import {
  CONTACT_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { capitalize } from 'lodash';
import { requestAccessHelper as requestAccessHelperComputed } from './requestAccessHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('requestAccessHelper', () => {
  const mockContactId1 = '4e53fade-4966-4efe-8b01-0cb5f587eb47';
  const mockContactId2 = '68a1e378-6e96-4e61-b06e-2cb4e6c22f48';
  const mockContactId3 = '00a770ee-eb7a-45df-a1ff-df1c01b9d756';

  const state = {
    caseDetail: MOCK_CASE,
    form: {},
    validationErrors: {},
  };

  const requestAccessHelper = withAppContextDecorator(
    requestAccessHelperComputed,
    applicationContext,
  );

  const filersMap = {
    [mockContactId1]: true,
    [mockContactId2]: false,
    [mockContactId3]: true,
  };

  applicationContext.getCurrentUser = () => ({
    role: ROLES.privatePractitioner,
  });

  beforeEach(() => {
    state.form = {
      filersMap,
    };
    state.caseDetail = {
      petitioners: [
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
      ],
    };
  });

  it('returns correct values when documentType is undefined', () => {
    let testState = {
      ...state,
      form: { documentType: undefined, filersMap: {} },
    };

    const expected = {
      showPrimaryDocumentValid: false,
    };

    const result = runCompute(requestAccessHelper, {
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

    const result = runCompute(requestAccessHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('generates correctly formatted service date', () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = runCompute(requestAccessHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', () => {
    const result = runCompute(requestAccessHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('returns correct number of document options for user role privatePractitioner', () => {
    const result = runCompute(requestAccessHelper, { state });
    expect(result.documents.length).toEqual(7);
  });

  it('returns correct number of document options for user role irsPractitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });
    const result = runCompute(requestAccessHelper, { state });
    expect(result.documents.length).toEqual(2);
  });

  it('shows filing includes if certificate of service or attachments is true', () => {
    state.form = { certificateOfService: true, filersMap };
    let result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);

    state.form = {
      attachments: true,
      certificateOfService: false,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);
  });

  it('does not show filing includes if certificate of service and attachments are false', () => {
    state.form = {
      attachments: false,
      certificateOfService: false,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    const result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingIncludes).toEqual(false);
  });

  it('shows filing not includes if certificate of service, attachments, or supporting documents is false', () => {
    state.form = { certificateOfService: false, filersMap };
    let result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      certificateOfService: true,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      attachments: false,
      certificateOfService: true,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      attachments: true,
      certificateOfService: true,
      documentType: 'Motion to Substitute Parties and Change Caption',
      filersMap,
      hasSupportingDocuments: false,
    };
    result = runCompute(requestAccessHelper, { state });
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
    const result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(false);
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
      };
    });

    it('should be set to the names of all petitioners being represented', () => {
      const { representingPartiesNames } = runCompute(requestAccessHelper, {
        state,
      });

      expect(representingPartiesNames).toEqual([
        'bob, Petitioner',
        `rick, ${capitalize(CONTACT_TYPES.participant)}`,
      ]);
    });
  });
});
