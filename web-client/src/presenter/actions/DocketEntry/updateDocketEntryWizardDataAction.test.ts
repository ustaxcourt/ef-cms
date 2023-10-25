import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDocketEntryWizardDataAction } from './updateDocketEntryWizardDataAction';

describe('updateDocketEntryWizardDataAction', () => {
  const { DOCUMENT_RELATIONSHIPS } = applicationContext.getConstants();

  const caseDetail = {
    docketEntries: [
      {
        docketEntryId: '1',
        documentTitle: 'A Document',
        documentType: 'A Document',
      },
      {
        docketEntryId: '2',
        documentTitle: 'B Document',
        documentType: 'B Document',
        relationship: DOCUMENT_RELATIONSHIPS.SECONDARY,
      },
      {
        docketEntryId: '3',
        documentTitle: 'C Document',
        documentType: 'C Document',
        relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      },
    ],
  };

  presenter.providers.applicationContext = applicationContext;

  describe('initEventCode', () => {
    it('should not override documentTitle', async () => {
      const mockDocumentTitle = 'Entry of Disappearance';
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'initEventCode',
          value: 'EA',
        },
        state: {
          form: {
            documentTitle: mockDocumentTitle,
          },
        },
      });

      expect(result.state.form.documentTitle).toEqual(mockDocumentTitle);
    });
  });

  describe('certificateOfService', () => {
    it('clear Certificate Of Service date items when certificateOfService is updated', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'certificateOfService',
        },
        state: {
          form: {
            certificateOfServiceDate: '12-12-2012',
          },
        },
      });

      expect(result.state.form.certificateOfServiceDate).toEqual(undefined);
    });
  });

  describe('eventCode', () => {
    it('unsets form state values when props.key=eventCode', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'eventCode',
        },
        state: {
          form: {
            documentTitle: 'document title',
            secondaryDocument: {
              freeText: 'Guy Fieri is my spirit animal.',
              ordinalValue: 'asdf',
              previousDocument: {},
              serviceDate: applicationContext
                .getUtilities()
                .createISODateString(),
              trialLocation: 'Flavortown',
            },
          },
        },
      });

      expect(result.state.form).toEqual({});
    });

    it('sets default previousDocument and metadata when props.key=eventCode, state.screenMetadata.supporting is true, and there is only one previous document', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'eventCode',
        },
        state: {
          caseDetail,
          form: {
            documentTitle: 'document title',
            secondaryDocument: {
              freeText: 'Guy Fieri is my spirit animal.',
              ordinalValue: 'asdf',
              previousDocument: {},
              serviceDate: applicationContext
                .getUtilities()
                .createISODateString(),
              trialLocation: 'Flavortown',
            },
          },
          screenMetadata: {
            filedDocketEntryIds: ['3'],
            primary: { something: true, somethingElse: false },
            supporting: true,
          },
        },
      });

      expect(result.state.form.previousDocument).toEqual({
        docketEntryId: '3',
        documentTitle: 'C Document',
        documentType: 'C Document',
        relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      });
      expect(result.state.form).toEqual({
        previousDocument: {
          docketEntryId: '3',
          documentTitle: 'C Document',
          documentType: 'C Document',
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
        },
        something: true,
        somethingElse: false,
      });
    });

    it('does not set default previousDocument and metadata when props.key=eventCode, state.screenMetadata.supporting is true, but there is more than one previous document', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'eventCode',
        },
        state: {
          caseDetail,
          form: {
            documentTitle: 'document title',
            secondaryDocument: {
              freeText: 'Guy Fieri is my spirit animal.',
              ordinalValue: 'asdf',
              previousDocument: {},
              serviceDate: applicationContext
                .getUtilities()
                .createISODateString(),
              trialLocation: 'Flavortown',
            },
          },
          screenMetadata: {
            filedDocketEntryIds: ['2', '3'],
            primary: { something: true, somethingElse: false },
            secondary: { something: true, somethingElse: false },
            supporting: true,
          },
        },
      });

      expect(result.state.form.previousDocument).toEqual(undefined);
      expect(result.state.form).toEqual({});
    });
  });

  describe('secondaryDocument.eventCode', () => {
    it('unsets secondaryDocument form state values', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'secondaryDocument.eventCode',
        },
        state: {
          form: {
            documentTitle: 'document title',
            secondaryDocument: {
              freeText: 'Guy Fieri is my spirit animal.',
              ordinalValue: 'asdf',
              previousDocument: {},
              serviceDate: applicationContext
                .getUtilities()
                .createISODateString(),
              trialLocation: 'Flavortown',
            },
          },
        },
      });

      expect(result.state.form).toEqual({
        documentTitle: 'document title',
      });
    });
  });

  describe('previousDocument', () => {
    it('does nothing if props.key is previousDocument and screenMetadata.supporting is false', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'previousDocument',
          value: 'C Document',
        },
        state: {
          caseDetail,
          form: {
            attachments: 'something else',
          },
          screenMetadata: {
            filedDocketEntryIds: ['3', '2'],
            primary: { primarySomething: true },
            supporting: false,
          },
        },
      });

      expect(result.state.form.attachments).toEqual('something else');
      expect(result.state.form.primarySomething).toBeUndefined();
    });

    it('unsets previous document form fields if screenMetadata.supporting is true and does not set doc information if previous document has no relationship', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'previousDocument',
          value: 'A Document',
        },
        state: {
          caseDetail,
          form: {
            certificateOfService: false,
          },
          screenMetadata: {
            filedDocketEntryIds: ['1', '2'],
            secondary: { secondarySomething: 'abc' },
            supporting: true,
          },
        },
      });

      expect(result.state.form).toEqual({});
    });

    it('unsets previous document form fields if screenMetadata.supporting is true and sets secondary doc information if relationship if secondary', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'previousDocument',
          value: 'B Document',
        },
        state: {
          caseDetail,
          form: {
            certificateOfService: false,
          },
          screenMetadata: {
            filedDocketEntryIds: ['3', '2'],
            secondary: { secondarySomething: 'abc' },
            supporting: true,
          },
        },
      });

      expect(result.state.form.certificateOfService).toEqual(undefined);
      expect(result.state.form.secondarySomething).toEqual('abc');
    });

    it('unsets previous document form fields if screenMetadata.supporting is true and sets primary doc information if relationship if primary', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'previousDocument',
          value: 'C Document',
        },
        state: {
          caseDetail,
          form: {
            attachments: 'something else',
          },
          screenMetadata: {
            filedDocketEntryIds: ['3', '2'],
            primary: { primarySomething: true },
            supporting: true,
          },
        },
      });

      expect(result.state.form.attachments).toEqual(undefined);
      expect(result.state.form.primarySomething).toEqual(true);
    });
  });

  describe('additionalInfo', () => {
    it('unsets additionalInfo if empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'additionalInfo',
        },
        state: {
          form: {
            additionalInfo: '',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo).toEqual(undefined);
    });

    it('does not unset additionalInfo if not empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'additionalInfo',
          value: 'abc',
        },
        state: {
          form: {
            additionalInfo: 'abc',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo).toEqual('abc');
    });
  });

  describe('additionalInfo2', () => {
    it('does not unset additionalInfo2 if not empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },

        props: {
          key: 'additionalInfo2',
          value: 'abc',
        },
        state: {
          form: {
            additionalInfo2: 'abc',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo2).toEqual('abc');
    });

    it('unsets additionalInfo2 if empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },

        props: {
          key: 'additionalInfo2',
        },
        state: {
          form: {
            additionalInfo2: '',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo2).toEqual(undefined);
    });
  });

  describe('hasOtherFilingParty', () => {
    it('should clear otherFilingParty when hasOtherFilingParty is updated', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'hasOtherFilingParty',
        },
        state: {
          form: {
            otherFilingParty: 'Not the petitioner',
          },
        },
      });

      expect(result.state.form.otherFilingParty).toEqual(undefined);
    });
  });
});
