import { addCourtIssuedDocketEntryHelper as addCourtIssuedDocketEntryHelperComputed } from './addCourtIssuedDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('addCourtIssuedDocketEntryHelper', () => {
  const {
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    UNSERVABLE_EVENT_CODES,
    USER_ROLES,
  } = applicationContext.getConstants();

  let user = {
    role: USER_ROLES.docketClerk,
  };
  let mockConstants = {
    COURT_ISSUED_EVENT_CODES: [
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
    ],
    EVENT_CODES_REQUIRING_SIGNATURE: ['O'],
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    UNSERVABLE_EVENT_CODES: UNSERVABLE_EVENT_CODES,
    USER_ROLES: {
      petitionsClerk: USER_ROLES.petitionsClerk,
    },
  };

  const addCourtIssuedDocketEntryHelper = withAppContextDecorator(
    addCourtIssuedDocketEntryHelperComputed,
    {
      ...applicationContext,
    },
  );

  const state = {
    caseDetail: {
      contactPrimary: { name: 'Banzai' },
      contactSecondary: { name: 'Timon' },
      docketEntries: [{ docketEntryId: '123' }],
      irsPractitioners: [{ name: 'Rafiki' }, { name: 'Pumbaa' }],
      privatePractitioners: [
        { name: 'Scar', representing: [] },
        { name: 'Zazu', representing: [] },
      ],
    },
    docketEntryId: '123',
    form: {
      generatedDocumentTitle: 'Circle of Life',
    },
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext.getConstants.mockImplementation(() => mockConstants);
  });

  it('should calculate document types based on constants in applicationContext', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, { state });
    expect(result.documentTypes).toEqual([
      {
        code: 'Simba',
        documentType: 'Lion',
        eventCode: 'ROAR',
        label: 'Lion',
        value: 'ROAR',
      },
      {
        code: 'Shenzi',
        documentType: 'Hyena',
        eventCode: 'HAHA',
        label: 'Hyena',
        value: 'HAHA',
      },
      {
        code: 'Shenzi',
        documentType: 'Hyena',
        eventCode: 'O',
        label: 'Hyena',
        value: 'O',
      },
    ]);
  });

  it('should provide a list of service parties based on case detail information', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, { state });
    expect(result.serviceParties).toMatchObject([
      { displayName: 'Banzai, Petitioner', name: 'Banzai' },
      { displayName: 'Timon, Petitioner', name: 'Timon' },
      { displayName: 'Scar, Petitioner Counsel', name: 'Scar' },
      { displayName: 'Zazu, Petitioner Counsel', name: 'Zazu' },
      { displayName: 'Rafiki, Respondent Counsel', name: 'Rafiki' },
      { displayName: 'Pumbaa, Respondent Counsel', name: 'Pumbaa' },
    ]);
  });

  it('should provide a list of service parties with a primary contact but no secondary contact', () => {
    const noSecondary = cloneDeep(state);
    delete noSecondary.caseDetail.contactSecondary;
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: noSecondary,
    });
    expect(result.serviceParties).toMatchObject([
      { displayName: 'Banzai, Petitioner', name: 'Banzai' },
      { displayName: 'Scar, Petitioner Counsel', name: 'Scar' },
      { displayName: 'Zazu, Petitioner Counsel', name: 'Zazu' },
      { displayName: 'Rafiki, Respondent Counsel', name: 'Rafiki' },
      { displayName: 'Pumbaa, Respondent Counsel', name: 'Pumbaa' },
    ]);
  });

  it('should return showServiceStamp true if the selected event code is O', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        form: {
          eventCode: 'O',
        },
      },
    });
    expect(result.showServiceStamp).toEqual(true);
  });

  it('should return showServiceStamp false if an event code is not selected on the form', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        form: {},
      },
    });
    expect(result.showServiceStamp).toEqual(false);
  });

  it('should return showServiceStamp false if the selected event code is anything other than O', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        form: {
          eventCode: 'OLA',
        },
      },
    });
    expect(result.showServiceStamp).toEqual(false);
  });

  it('should return a formatted document title', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, { state });

    expect(result.formattedDocumentTitle).toEqual('Circle of Life');
  });

  it('should return an empty string for a formattedDocumentTitle if generatedDocumentTitle and attachments are undefined', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        form: {},
      },
    });

    expect(result.formattedDocumentTitle).toEqual('');
  });

  it('should return a formatted document title with `(Attachment(s))` when present', () => {
    const withAttachments = cloneDeep(state);
    withAttachments.form.attachments = true;
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: withAttachments,
    });

    expect(result.formattedDocumentTitle).toEqual(
      'Circle of Life (Attachment(s))',
    );
  });

  it('should not show service stamp if user is petitions clerk', () => {
    user.role = USER_ROLES.petitionsClerk;
    const result = runCompute(addCourtIssuedDocketEntryHelper, { state });
    expect(result.showServiceStamp).toEqual(false);
  });

  it('should return showSaveAndServeButton false if eventCode is found in unservable event codes list', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        caseDetail: {
          ...state.caseDetail,
          docketEntries: [
            {
              docketEntryId: '123',
              signedAt: '2019-03-01T21:40:46.415Z',
            },
          ],
        },
        docketEntryId: '123',
        form: {
          eventCode: UNSERVABLE_EVENT_CODES[0],
        },
      },
    });
    expect(result.showSaveAndServeButton).toEqual(false);
  });

  it('should return showSaveAndServeButton true if eventCode is NOT found in unservable event codes list', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        caseDetail: {
          ...state.caseDetail,
          docketEntries: [
            {
              docketEntryId: '123',
              signedAt: '2019-03-01T21:40:46.415Z',
            },
          ],
        },
        docketEntryId: '123',
        form: {
          eventCode: 'O',
        },
      },
    });
    expect(result.showSaveAndServeButton).toEqual(true);
  });

  it('should set showDocumentTypeDropdown to false when form.documentType is NODC', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        docketEntryId: '123',
        form: {
          eventCode: 'NODC',
        },
      },
    });

    expect(result.showDocumentTypeDropdown).toBeFalsy();
  });

  it('should set showDocumentTypeDropdown to true when form.documentType is NOT NODC', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        docketEntryId: '123',
        form: {
          eventCode: 'O',
        },
      },
    });

    expect(result.showDocumentTypeDropdown).toBeTruthy();
  });

  it('should set showReceivedDate to true when the document is unservable', () => {
    const result = runCompute(addCourtIssuedDocketEntryHelper, {
      state: {
        ...state,
        docketEntryId: '123',
        form: {
          eventCode: UNSERVABLE_EVENT_CODES[0],
        },
      },
    });

    expect(result.showReceivedDate).toBeTruthy();
  });
});
