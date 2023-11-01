import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearCaseAssociationWizardDataAction } from './clearCaseAssociationWizardDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearCaseAssociationWizardDataAction', () => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  it('clears certificateOfService', async () => {
    const result = await runAction(clearCaseAssociationWizardDataAction, {
      props: {
        key: 'certificateOfService',
      },
      state: {
        form: {
          certificateOfServiceDate: applicationContext
            .getUtilities()
            .createISODateString(),
        },
      },
    });

    expect(result.state.form).toEqual({});
  });
  it('clears objections', async () => {
    const result = await runAction(clearCaseAssociationWizardDataAction, {
      props: {
        key: 'documentType',
      },
      state: {
        form: {
          objections: OBJECTIONS_OPTIONS_MAP.YES,
        },
      },
    });

    expect(result.state.form.objections).toEqual(undefined);
  });
  it('clears objections but preserves other form attributes if value is defined', async () => {
    const result = await runAction(clearCaseAssociationWizardDataAction, {
      props: {
        key: 'documentType',
        value: 'Doc Holliday',
      },
      state: {
        form: {
          documentTitleTemplate: 'huckleberry',
          objections: OBJECTIONS_OPTIONS_MAP.YES,
        },
      },
    });

    expect(result.state.form.objections).toEqual(undefined);
    expect(result.state.form.documentTitleTemplate).toEqual('huckleberry');
  });
});
