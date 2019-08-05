import { presenter } from '../presenter';
import { printDocketRecordAction } from './printDocketRecordAction';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getEntityConstructors: () => {
    return {
      ContactFactory: {
        COUNTRY_TYPES: {
          INTERNATIONAL: 'International',
        },
      },
    };
  },
};

const state = {
  caseDetailHelper: {
    caseCaptionPostfix: 'Caption Postfix',
    showCaseNameForPrimary: false,
  },
  formattedCaseDetail: {
    caseCaption: 'Test Caption',
    caseDetailHelper: {},
    contactPrimary: {
      name: 'Test Petitioner',
    },
    contactSecondary: {},
    docketNumberWithSuffix: '123-45S',
    docketRecordWithDocument: [],
    practitioners: [
      {
        formattedName: 'Test Practitioner (PT1234)',
        representingPrimary: true,
        userId: '123',
      },
    ],
    respondents: [],
  },
};

describe('printDocketRecordAction', () => {
  it('generate html for a printable docket record', async () => {
    const result = await runAction(printDocketRecordAction, {
      modules: {
        presenter,
      },
      state,
    });

    expect(result.output.docketNumber).toEqual(
      state.formattedCaseDetail.docketNumberWithSuffix,
    );
    expect(result.output.docketRecordHtml).toContain(
      state.formattedCaseDetail.caseCaption,
    );
    expect(result.output.docketRecordHtml).toContain(
      state.formattedCaseDetail.contactPrimary.name,
    );
    expect(result.output.docketRecordHtml).toContain(
      state.caseDetailHelper.caseCaptionPostfix,
    );
    expect(result.output.docketRecordHtml).toContain(
      state.formattedCaseDetail.practitioners.formattedName,
    );
    expect(result.output.docketRecordHtml).toContain('Representing');
  });
});
