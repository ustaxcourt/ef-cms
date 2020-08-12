import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
import { setPropsForUpdateSectionInCreateCaseModalAction } from './setPropsForUpdateSectionInCreateCaseModalAction';

const { PETITIONS_SECTION } = applicationContext.getConstants();

describe('setPropsForUpdateSectionInCreateCaseModalAction', () => {
  it('returns form and section from props', async () => {
    const { output } = await runAction(
      setPropsForUpdateSectionInCreateCaseModalAction,
      {
        props: { key: 'toSection', value: PETITIONS_SECTION },
      },
    );

    expect(output).toEqual({
      form: 'modal.form',
      section: PETITIONS_SECTION,
    });
  });
});
