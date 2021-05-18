import { runAction } from 'cerebral/test';
import { setPractitionersAction } from './setPractitionersAction';

describe('setPractitionersAction', () => {
  it('sets state.modal.practitionerMatches to the passed in props.privatePractitioners and defaults state.modal.user to that user if there is only one match', async () => {
    const result = await runAction(setPractitionersAction, {
      props: {
        privatePractitioners: [{ name: 'Test Practitioner', userId: '123' }],
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.practitionerMatches).toEqual([
      { name: 'Test Practitioner', userId: '123' },
    ]);
    expect(result.state.modal.user).toEqual({
      name: 'Test Practitioner',
      userId: '123',
    });
  });

  it('sets state.modal.practitionerMatches to the passed in props.privatePractitioners and does not default state.modal.user if there is more than one match', async () => {
    const result = await runAction(setPractitionersAction, {
      props: {
        privatePractitioners: [
          { name: 'Test Practitioner', userId: '123' },
          { name: 'Test Practitioner2', userId: '234' },
        ],
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.practitionerMatches).toEqual([
      { name: 'Test Practitioner', userId: '123' },
      { name: 'Test Practitioner2', userId: '234' },
    ]);
    expect(result.state.modal.user).toBeUndefined();
  });

  it('sets state.modal.representingMap to an empty object', async () => {
    const result = await runAction(setPractitionersAction, {
      props: {
        privatePractitioners: [],
      },
      state: {
        modal: {
          representingMap: { '5e9f7ebe-b2d5-46c5-8c33-60018e14c311': true },
        },
      },
    });

    expect(result.state.modal.representingMap).toEqual({});
  });
});
