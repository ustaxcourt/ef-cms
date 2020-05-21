import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setValidationAlertErrorsAction } from './setValidationAlertErrorsAction';

describe('setValidationAlertErrors', () => {
  it('state.alertError contains the irsNoticeDate error', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          irsNoticeDate: 'Some issue occurred',
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: ['Some issue occurred'],
    });
  });

  it('creates messages for errors with nested objects', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          blues: { cobalt: 'cobalt is incorrect' },
          green: 'green is incorrect',
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: ['cobalt is incorrect', 'green is incorrect'],
    });
  });

  it('does not create messages for null errors', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          blues: null,
          green: 'green is incorrect',
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: ['green is incorrect'],
    });
  });

  it('creates messages for errors with nested arrays', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          blues: [{ index: 0 }, { cobalt: 'cobalt is incorrect', index: 1 }],
          green: 'green is incorrect',
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: ['blues #2 - cobalt is incorrect', 'green is incorrect'],
    });
  });

  it('orders errors by props.errorDisplayOrder', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errorDisplayOrder: ['b', 'a'],
        errors: {
          a: 'First issue occurred',
          b: 'Second issue occurred',
        },
      },
    });
    expect(state.alertError).toMatchObject({
      messages: ['Second issue occurred', 'First issue occurred'],
    });
  });

  it('maps nested error message text using errorDisplayMap', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errorDisplayMap: { something: 'Nicer Something' },
        errorDisplayOrder: ['nested2', 'nested1'],
        errors: {
          something: [
            {
              index: 0,
              nested1: 'first nested',
              nested2: 'second nested',
            },
          ],
        },
      },
    });
    expect(state.alertError).toMatchObject({
      messages: [
        'Nicer Something #1 - second nested',
        'Nicer Something #1 - first nested',
      ],
    });
  });

  it('orders errors by state.fieldOrder', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          a: 'First issue occurred',
          b: 'Second issue occurred',
        },
      },
      state: { fieldOrder: ['b', 'a'] },
    });
    expect(state.alertError).toMatchObject({
      messages: ['Second issue occurred', 'First issue occurred'],
    });
  });

  it('does not skip errors if they are not defined in state.fieldOrder', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          a: 'First issue occurred',
          b: 'Second issue occurred',
          c: 'Third issue occurred',
        },
      },
      state: { fieldOrder: ['b', 'a'] },
    });
    expect(state.alertError).toMatchObject({
      messages: [
        'Second issue occurred',
        'First issue occurred',
        'Third issue occurred',
      ],
    });
  });

  it('correctly retrieves nested errors when state.fieldOrder contains reference to a nested object', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          a: { something: 'First issue occurred' },
          b: 'Second issue occurred',
          c: 'Third issue occurred',
        },
      },
      state: { fieldOrder: ['b', 'a.something', 'd.somethingElse'] },
    });
    expect(state.alertError).toMatchObject({
      messages: [
        'Second issue occurred',
        'First issue occurred',
        'Third issue occurred',
      ],
    });
  });
});
