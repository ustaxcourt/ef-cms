import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { InvalidRequest } from '@web-api/errors/errors';
import { genericHandler } from '../../genericHandler';
import { getPractitionersByNameInteractor } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';

const parseSearchAfter = (
  searchAfter: string | undefined,
): (string | number | null)[] | undefined => {
  if (!searchAfter) {
    return undefined;
  }

  let parsedSearchAfter: unknown;
  try {
    parsedSearchAfter = JSON.parse(searchAfter);
  } catch {
    throw new InvalidRequest('searchAfter must be a valid JSON array');
  }

  if (!Array.isArray(parsedSearchAfter)) {
    throw new InvalidRequest('searchAfter must be a valid JSON array');
  }

  return parsedSearchAfter.map((value: unknown) => {
    if (value === null || typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    throw new InvalidRequest(
      'searchAfter values must be strings, numbers, or null',
    );
  });
};

/**
 * gets practitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionersByNameLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      name,
      practitionerType,
      practiceType,
      admissionStatus,
      originalBarState,
      searchAfter: searchAfterParameter,
    } = event.queryStringParameters;

    return await getPractitionersByNameInteractor(
      applicationContext,
      {
        name,
        searchAfter: parseSearchAfter(searchAfterParameter),
        practitionerType,
        practiceType,
        admissionStatus,
        originalBarState,
      },
      authorizedUser,
    );
  });
