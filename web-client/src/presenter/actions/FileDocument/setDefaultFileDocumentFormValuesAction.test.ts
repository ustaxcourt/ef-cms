import { GENERATION_TYPES } from '@web-client/getConstants';
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

  it('sets up the form with default values when allowExternalConsolidatedGroupFilingHelper returns true', async () => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      fileAcrossConsolidatedGroup: true,
      filersMap: {},
      generationType: GENERATION_TYPES.MANUAL,
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      practitioner: [],
    });
  });

  it('sets up the form with default values when allowExternalConsolidatedGroupFilingHelper returns false', async () => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
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

  it('should set filersMap[userId] to true if the logged in user is a petitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form.filersMap).toEqual({
      [petitionerUser.userId]: true,
    });
  });

  it('should default te generationType to manual', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: { generationType: undefined },
      },
    });

    expect(result.state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });
});
