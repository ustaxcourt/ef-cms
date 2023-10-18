import { GENERATION_TYPES } from '@web-client/getConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  MULTI_DOCKET_FILING_EVENT_CODES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultFileDocumentFormValuesAction } from './setDefaultFileDocumentFormValuesAction';

describe('setDefaultFileDocumentFormValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set fileAcrossConsolidatedGroup to false when the user is filing a document on a case that is NOT consolidated', async () => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          leadDocketNumber: undefined,
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      fileAcrossConsolidatedGroup: false,
      filersMap: {},
      generationType: GENERATION_TYPES.MANUAL,
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      practitioner: [],
    });
  });

  it('should set fileAcrossConsolidatedGroup to false when the user is filing on a consolidated case but the document they are filing is NOT multi-docketable', async () => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          leadDocketNumber: MOCK_CASE.docketNumber,
        },
        form: {
          eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
        },
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
      fileAcrossConsolidatedGroup: false,
      filersMap: {},
      generationType: GENERATION_TYPES.MANUAL,
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      practitioner: [],
    });
  });

  it('should set fileAcrossConsolidatedGroup to true when the user is filing a document on a case that is consolidated and they have chosen to file a document that is multi-docketable', async () => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          leadDocketNumber: MOCK_CASE.docketNumber,
        },
        form: {
          eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
        },
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
      fileAcrossConsolidatedGroup: true,
      filersMap: {},
      generationType: GENERATION_TYPES.MANUAL,
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      practitioner: [],
    });
  });

  it('should set filersMap[userId] to true when the logged in user is a petitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        caseDetail: {},
        form: {},
      },
    });

    expect(result.state.form.filersMap).toEqual({
      [petitionerUser.userId]: true,
    });
  });

  it('should default the generationType to manual', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        caseDetail: {},
        form: { generationType: undefined },
      },
    });

    expect(result.state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });
});
