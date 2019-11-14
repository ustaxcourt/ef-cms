import { addCourtIssuedDocketEntryHelper } from './addCourtIssuedDocketEntryHelper';
import { cloneDeep } from 'lodash';
import { runCompute } from 'cerebral/test';

const state = {
  caseDetail: {
    contactPrimary: { name: 'Banzai' },
    contactSecondary: { name: 'Timon' },
    practitioners: [{ name: 'Scar' }, { name: 'Zazu' }],
    respondents: [{ name: 'Rafiki' }, { name: 'Pumbaa' }],
  },
  constants: {
    COURT_ISSUED_EVENT_CODES: [
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
    ],
  },
  form: {},
};

describe('addCourtIssuedDocketEntryHelper', () => {
  it('should calculate document types based on constants in state', () => {
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
      { displayName: 'Respondent', serviceType: 'Electronic' },
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
      { displayName: 'Respondent', serviceType: 'Electronic' },
    ]);
  });
});
