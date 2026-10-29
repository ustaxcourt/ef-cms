import {
  findUnauthorizedPublicFields,
  isPublicSiteRequest,
} from './publicDataSanitizer';
import { PublicUser } from '@shared/business/entities/PublicUser';

describe('isPublicSiteRequest', () => {
  it.each([
    {
      event: {
        headers: { host: 'public-api-blue.example.gov' },
        path: '/cases/101-20',
      },
      expected: true,
    },
    {
      event: {
        headers: { host: 'localhost:4001' },
        path: '/cases/101-20',
      },
      expected: true,
    },
    {
      event: {
        headers: { host: 'public-api-green.example.gov' },
        path: '/system/feature-flag',
      },
      expected: true,
    },
    {
      event: {
        headers: { host: 'localhost:4001' },
        path: '/system/feature-flag',
      },
      expected: true,
    },
    {
      event: {
        headers: { host: 'example.gov' },
        path: '/api/cases/101-20',
      },
      expected: false,
    },
    {
      event: {
        headers: { host: 'example.gov' },
        path: '/system/feature-flag',
      },
      expected: false,
    },
    {
      event: {
        headers: { host: 'example.gov' },
        path: '/api/system/feature-flagged',
      },
      expected: false,
    },
  ])('returns $expected for request $event', ({ event, expected }) => {
    expect(isPublicSiteRequest(event)).toBe(expected);
  });

  it('uses url when the API Gateway path is absent', () => {
    expect(
      isPublicSiteRequest({
        headers: { host: 'example.gov' },
        url: '/public-api/cases/101-20',
      }),
    ).toBe(true);
  });

  it('returns no findings for an empty event path and a valid public entity', () => {
    expect(
      findUnauthorizedPublicFields({
        event: {},
        response: new PublicUser({
          name: 'Test User',
          role: 'petitioner',
        }).validate(),
      }),
    ).toEqual([]);
  });
});
