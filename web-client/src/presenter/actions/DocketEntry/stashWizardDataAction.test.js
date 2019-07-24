import { runAction } from 'cerebral/test';
import { stashWizardDataAction } from './stashWizardDataAction';

describe('stashWizardDataAction', () => {
  it('should stash primary and secondary document data and filedDocumentIds', async () => {
    const result = await runAction(stashWizardDataAction, {
      props: {
        primaryDocumentFileId: 'Forward',
        secondaryDocumentFileId: 'Something',
      },
      state: {
        caseDetail: {},
        form: {
          dateReceived: '2012-01-01',
          dateReceivedDay: '01',
          dateReceivedMonth: '01',
          dateReceivedYear: '2012',
          lodged: false,
          partyPrimary: false,
          partyRespondent: false,
          partySecondary: false,
          practitioner: {
            name: 'Test Practitioner',
            partyPractitioner: false,
          },
          secondaryDocument: {
            something: true,
          },
        },
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.filedDocumentIds).toEqual([
      'Forward',
      'Something',
    ]);
    expect(result.state.screenMetadata.primary).toEqual({
      dateReceived: '2012-01-01',
      dateReceivedDay: '01',
      dateReceivedMonth: '01',
      dateReceivedYear: '2012',
      lodged: false,
      partyPrimary: false,
      partyRespondent: false,
      partySecondary: false,
      practitioner: {
        name: 'Test Practitioner',
        partyPractitioner: false,
      },
    });
    expect(result.state.screenMetadata.secondary).toEqual({
      dateReceived: '2012-01-01',
      dateReceivedDay: '01',
      dateReceivedMonth: '01',
      dateReceivedYear: '2012',
      lodged: true,
      partyPrimary: false,
      partyRespondent: false,
      partySecondary: false,
      practitioner: {
        name: 'Test Practitioner',
        partyPractitioner: false,
      },
    });
  });
});
