import { primeDoNotProceedPropAction } from './primeDoNotProceedPropAction';
import { runAction } from 'cerebral/test';

describe('primeDoNotProceedPropAction', () => {
  it('should set doNotProceed to TRUE if there is no document type selected', async () => {
    const result = await runAction(primeDoNotProceedPropAction, {
      state: {
        form: {},
        screenMetadata: {
          isDocumentTypeSelected: false,
        },
      },
    });

    expect(result.output.doNotProceed).toBeTruthy();
  });

  it('should set doNotProceed to TRUE if a secondary document is needed and no secondary type is selected for a Nonstandard H scenario', async () => {
    const result = await runAction(primeDoNotProceedPropAction, {
      state: {
        form: {
          scenario: 'Nonstandard H',
        },
        screenMetadata: {
          isSecondaryDocumentTypeSelected: false,
        },
      },
    });

    expect(result.output.doNotProceed).toBeTruthy();
  });

  it('should set doNotProceed to FALSE if a secondary document is needed, no secondary type is selected for a different scenario', async () => {
    const result = await runAction(primeDoNotProceedPropAction, {
      state: {
        form: {
          scenario: 'Nonstandard H',
        },
        screenMetadata: {
          isDocumentTypeSelected: true,
          isSecondaryDocumentTypeSelected: true,
        },
      },
    });

    expect(result.output.doNotProceed).toBeFalsy();
  });

  it('should set doNotProceed to FALSE if a secondary document is not needed and no secondary type is selected', async () => {
    const result = await runAction(primeDoNotProceedPropAction, {
      state: {
        form: {
          scenario: 'Nonstandard',
        },
        screenMetadata: {
          isDocumentTypeSelected: true,
          isSecondaryDocumentTypeSelected: false,
        },
      },
    });

    expect(result.output.doNotProceed).toBeFalsy();
  });
});
