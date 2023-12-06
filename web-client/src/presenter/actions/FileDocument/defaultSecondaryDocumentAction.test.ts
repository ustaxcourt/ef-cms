import { defaultSecondaryDocumentAction } from './defaultSecondaryDocumentAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('defaultSecondaryDocumentAction', () => {
  it('sets the default form values for a secondary document if the scenario is Nonstandard H', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {
          scenario: 'Nonstandard H',
        },
      },
    });

    expect(result.state).toMatchObject({
      form: {
        secondaryDocument: {},
      },
    });
  });

  it('should not set form values to false when the scenario is Nonstandard H and there is a secondary document with attachments and certificate of service', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {
          scenario: 'Nonstandard H',
          secondaryDocument: {
            attachments: 'yo',
            certificateOfService: 'blah',
          },
        },
      },
    });

    expect(result.state).toMatchObject({
      form: {
        secondaryDocument: {
          attachments: 'yo',
          certificateOfService: 'blah',
        },
      },
    });
  });

  it('should set form values to false when the scenario is Nonstandard H and there is a secondary document without attachments or certificate of service', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {
          scenario: 'Nonstandard H',
          secondaryDocument: {
            attachments: undefined,
            certificateOfService: undefined,
          },
        },
      },
    });

    expect(result.state).toMatchObject({
      form: {
        secondaryDocument: {
          attachments: false,
          certificateOfService: false,
        },
      },
    });
  });

  it('unsets the secondary document if the scenario is not Nonstandard H', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {
          scenario: 'Standard',
        },
      },
    });

    expect(result.state).toEqual({
      form: {
        scenario: 'Standard',
      },
    });
  });
});
