import { runAction } from '@web-client/presenter/test.cerebral';
import { setRespondentsAction } from './setRespondentsAction';

describe('setRespondentsAction', () => {
  it('sets state.modal.respondentMatches to the passed in props.irsPractitioners and defaults state.modal.user to that user if there is only one match', async () => {
    const result = await runAction(setRespondentsAction, {
      props: { irsPractitioners: [{ name: 'Test Respondent', userId: '123' }] },
      state: {
        modal: {},
      },
    });
    expect(result.state.modal.respondentMatches).toEqual([
      { name: 'Test Respondent', userId: '123' },
    ]);
    expect(result.state.modal.user).toEqual({
      name: 'Test Respondent',
      userId: '123',
    });
  });

  it('sets state.modal.respondentMatches to the passed in props.irsPractitioners and does not default state.modal.user if there is more than one match', async () => {
    const result = await runAction(setRespondentsAction, {
      props: {
        irsPractitioners: [
          { name: 'Test Respondent', userId: '123' },
          { name: 'Test Respondent2', userId: '234' },
        ],
      },
      state: {
        modal: {},
      },
    });
    expect(result.state.modal.respondentMatches).toEqual([
      { name: 'Test Respondent', userId: '123' },
      { name: 'Test Respondent2', userId: '234' },
    ]);
    expect(result.state.modal.user).toBeUndefined();
  });
});
