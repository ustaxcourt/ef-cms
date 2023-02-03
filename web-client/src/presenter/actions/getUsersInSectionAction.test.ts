import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUsersInSectionAction } from './getUsersInSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getUsersInSectionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should retrieve all the users in the section provided', async () => {
    const mockSection = 'Test Section';
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue([]);

    await runAction(getUsersInSectionAction({ section: mockSection }), {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor.mock
        .calls[0][1].section,
    ).toBe(mockSection);
  });

  it("should retrieve all the users in the current user's section when a section is not provided", async () => {
    const mockSection = 'Test User Section';
    applicationContext.getCurrentUser.mockReturnValue({
      section: mockSection,
    });
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue([]);

    await runAction(getUsersInSectionAction({ section: undefined }), {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor.mock
        .calls[0][1].section,
    ).toBe(mockSection);
  });

  it('should return the list of users sorted by name', async () => {
    const mockUsers = [
      {
        name: 'Wonder Woman',
      },
      {
        name: 'The Incredible Hulk',
      },
      {
        name: 'Dr. Strange',
      },
      {
        name: 'Thor',
      },
    ];
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue(mockUsers);

    const result = await runAction(
      getUsersInSectionAction({ section: 'judge' }),
      {
        modules: {
          presenter,
        },
      },
    );

    expect(result.output.users).toEqual([
      {
        name: 'Dr. Strange',
      },
      {
        name: 'The Incredible Hulk',
      },
      {
        name: 'Thor',
      },
      {
        name: 'Wonder Woman',
      },
    ]);
  });
});
