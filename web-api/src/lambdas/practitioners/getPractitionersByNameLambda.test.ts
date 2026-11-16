jest.mock('../../genericHandler');
jest.mock(
  '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor',
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { genericHandler as genericHandlerMock } from '../../genericHandler';
import { getPractitionersByNameInteractor as interactorMock } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';
import { getPractitionersByNameLambda } from './getPractitionersByNameLambda';

describe('getPractitionersByNameLambda', () => {
  const genericHandler = genericHandlerMock as jest.Mock;
  const interactor = interactorMock as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    genericHandler.mockImplementation((_awsEvent, cb) => {
      return cb({ applicationContext });
    });
  });

  it('parses JSON pagination cursors and preserves null values', async () => {
    const searchAfter = [null, 'smith', 'SB1234', 42];

    await getPractitionersByNameLambda(
      {
        queryStringParameters: {
          name: 'smith',
          searchAfter: JSON.stringify(searchAfter),
        },
      },
      mockPetitionsClerkUser,
    );

    expect(interactor).toHaveBeenCalledWith(
      applicationContext,
      expect.objectContaining({ name: 'smith', searchAfter }),
      mockPetitionsClerkUser,
    );
  });

  it('omits a pagination cursor when none is provided', async () => {
    await getPractitionersByNameLambda(
      {
        queryStringParameters: {
          name: 'smith',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(interactor).toHaveBeenCalledWith(
      applicationContext,
      expect.objectContaining({ name: 'smith', searchAfter: undefined }),
      mockPetitionsClerkUser,
    );
  });

  it('rejects invalid pagination cursor values', async () => {
    await expect(
      getPractitionersByNameLambda(
        {
          queryStringParameters: {
            name: 'smith',
            searchAfter: JSON.stringify([null, { invalid: true }]),
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('searchAfter values must be strings, numbers, or null');

    expect(interactor).not.toHaveBeenCalled();
  });

  it('rejects malformed or non-array pagination cursors', async () => {
    await expect(
      getPractitionersByNameLambda(
        {
          queryStringParameters: {
            name: 'smith',
            searchAfter: 'not-json',
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('searchAfter must be a valid JSON array');

    await expect(
      getPractitionersByNameLambda(
        {
          queryStringParameters: {
            name: 'smith',
            searchAfter: JSON.stringify({ invalid: true }),
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('searchAfter must be a valid JSON array');

    await expect(
      getPractitionersByNameLambda(
        {
          queryStringParameters: {
            name: 'smith',
            searchAfter: '[1e400]',
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('searchAfter values must be strings, numbers, or null');

    expect(interactor).not.toHaveBeenCalled();
  });
});
