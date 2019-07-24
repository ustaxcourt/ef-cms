import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { Document } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { addDocketEntryHelper as addDocketEntryHelperComputed } from './addDocketEntryHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP: Document.CATEGORY_MAP,
    INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
    PARTY_TYPES: ContactFactory.PARTY_TYPES,
  },
  form: {},
  validationErrors: {},
};

const addDocketEntryHelper = withAppContextDecorator(
  addDocketEntryHelperComputed,
);

describe('addDocketEntryHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns correct values when documentType is undefined', async () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      showObjection: false,
      showPractitionerParty: false,
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
      showSecondaryParty: false,
    };

    const result = await runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });

  it('does not error with empty caseDetail (for cerebral debugger)', async () => {
    let testState = {
      caseDetail: {},
      constants: {
        CATEGORY_MAP: Document.CATEGORY_MAP,
        INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
        PARTY_TYPES: ContactFactory.PARTY_TYPES,
      },
    };

    const result = await runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject({});
  });

  it('shows objection if document type is a motion', async () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      eventCode: 'M115',
      scenario: 'Nonstandard H',
    };
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showObjection).toBeTruthy();
    expect(result.primary.showSecondaryDocumentForm).toBeTruthy();
  });

  it('indicates file uploads are valid', async () => {
    state.form = {
      documentType: 'Agreed Computation for Entry of Decision',
      primaryDocumentFile: { some: 'file' },
    };

    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('shows secondary party for petionerSpouse or petitionerDeceasedSpouse', async () => {
    state.caseDetail.partyType = ContactFactory.PARTY_TYPES.petitionerSpouse;
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('generates correctly formatted service date', async () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('does not show party validation error if none of the party validation errors exists', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', async () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('does not show respondent option under Parties Filing if no respondent is associated with case', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showRespondentParty).toBeFalsy();
  });

  it('shows respondent option under Parties Filing if a respondent is associated with case', async () => {
    state.caseDetail.respondents = [{ name: 'Test Respondent' }];
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showRespondentParty).toBeTruthy();
  });

  it('does not show practitioner option under Parties Filing if practitioners on case is an empty array', async () => {
    state.caseDetail.practitioners = [];
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();
  });

  it('does not show practitioner option under Parties Filing if practitioners on case is not defined', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();
  });

  it('shows single practitioner under Parties Filing if they are associated with the case', async () => {
    state.caseDetail.practitioners = [{ name: 'Test Practitioner' }];
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showPractitionerParty).toBeTruthy();
    expect(result.practitionerNames).toEqual(['Test Practitioner']);
  });

  it('shows multiple practitioners under Parties Filing if they are associated with the case', async () => {
    state.caseDetail.practitioners = [
      { name: 'Test Practitioner' },
      { name: 'Test Practitioner1' },
    ];
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showPractitionerParty).toBeTruthy();
    expect(result.practitionerNames).toEqual([
      'Test Practitioner',
      'Test Practitioner1',
    ]);
  });

  it("shows should show inclusions when previous document isn't secondary", async () => {
    state.form.previousDocument = 'Statement of Taxpayer Identification';
    state.screenMetadata = {
      filedDocumentIds: ['abc81f4d-1e47-423a-8caf-6d2fdc3d3859'],
    };
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showSupportingInclusions).toBeTruthy();
  });
});
