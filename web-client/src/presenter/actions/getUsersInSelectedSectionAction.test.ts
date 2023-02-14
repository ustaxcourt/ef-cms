import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUsersInSelectedSectionAction } from './getUsersInSelectedSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getUsersInSelectedSectionAction', () => {
  const SECTION = 'petitions';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue([
        {
          name: 'Chicken',
        },
        {
          name: 'Bob',
        },
        {
          name: 'Althea',
        },
      ]);
  });

  it('should return an empty object for users when props.section is not defined', async () => {
    const results = await runAction(getUsersInSelectedSectionAction, {
      modules: { presenter },
      props: {},
    });

    expect(results.output).toEqual({
      users: [],
    });
  });

  it('should call getUsersInSectionInteractor with the props.section', async () => {
    await runAction(getUsersInSelectedSectionAction, {
      modules: { presenter },
      props: { section: SECTION },
    });

    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      section: SECTION,
    });
  });

  it('should return retrieved users sorted by name', async () => {
    const result = await runAction(getUsersInSelectedSectionAction, {
      modules: { presenter },
      props: { section: SECTION },
    });

    expect(result.output).toEqual({
      users: [
        {
          name: 'Althea',
        },
        {
          name: 'Bob',
        },
        {
          name: 'Chicken',
        },
      ],
    });
  });
});
