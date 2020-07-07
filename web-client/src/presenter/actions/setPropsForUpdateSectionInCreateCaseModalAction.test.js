import { runAction } from 'cerebral/test';
import { setPropsForUpdateSectionInCreateCaseModalAction } from './setPropsForUpdateSectionInCreateCaseModalAction';

describe('setPropsForUpdateSectionInCreateCaseModalAction', () => {
  it('returns form and section from props', async () => {
    const { output } = await runAction(
      setPropsForUpdateSectionInCreateCaseModalAction,
      {
        props: { key: 'toSection', value: 'petitions' },
      },
    );

    expect(output).toEqual({
      form: 'modal.form',
      section: 'petitions',
    });
  });
});
