import {
  CAV_AND_SUBMITTED_CASE_STATUS,
  MAX_ELASTICSEARCH_PAGINATION,
} from '@shared/business/entities/EntityConstants';
import {
  DocketNumberByStatusRequest,
  getDocketNumbersByStatusAndByJudge,
} from './getDocketNumbersByStatusAndByJudge';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '@shared/test/mockUsers';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('getDocketNumbersByStatusAndByJudge', () => {
  const mockValidRequest: DocketNumberByStatusRequest = {
    judges: [judgeUser.name],
    statuses: CAV_AND_SUBMITTED_CASE_STATUS,
  };

  const standaloneCase = { docketNumber: '11315-18' };
  const leadCase = { docketNumber: '11316-18', leadDocketNumber: '11316-18' };
  const memberCase = { docketNumber: '11317-18', leadDocketNumber: '11316-18' };
  const responseResults = [standaloneCase, leadCase, memberCase];

  beforeAll(() => {
    (search as jest.Mock).mockImplementation(() => ({
      results: responseResults,
    }));
  });

  it('should make a persistence call to obtain all cases with a status of "Submitted" or "CAV" associated with the given judges', async () => {
    const docketNumbersSearchResults = await getDocketNumbersByStatusAndByJudge(
      {
        applicationContext,
        params: mockValidRequest,
      },
    );

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.size,
    ).toEqual(MAX_ELASTICSEARCH_PAGINATION);

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .should,
    ).toMatchObject(
      expect.arrayContaining([
        { match_phrase: { 'associatedJudge.S': judgeUser.name } },
      ]),
    );

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .filter,
    ).toMatchObject(
      expect.arrayContaining([
        {
          terms: { 'status.S': CAV_AND_SUBMITTED_CASE_STATUS },
        },
      ]),
    );

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .minimum_should_match,
    ).toEqual(1);

    expect(docketNumbersSearchResults).toMatchObject(responseResults);
  });

  it('should make a persistence call to obtain all cases with a status of "Submitted" or "CAV" without judges', async () => {
    await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: { ...mockValidRequest, judges: undefined },
    });

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.size,
    ).toEqual(MAX_ELASTICSEARCH_PAGINATION);

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .should,
    ).toMatchObject([]);

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .minimum_should_match,
    ).toEqual(1);

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .filter,
    ).toMatchObject(
      expect.arrayContaining([
        {
          terms: { 'status.S': CAV_AND_SUBMITTED_CASE_STATUS },
        },
      ]),
    );
  });

  it('excludes member cases if the flag is set to true', async () => {
    const results = await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        ...mockValidRequest,
        excludeMemberCases: true,
      },
    });

    expect(results).toEqual(expect.arrayContaining([standaloneCase, leadCase]));
    expect(results).not.toEqual(expect.arrayContaining([memberCase]));
  });

  it('includes member cases by default', async () => {
    const results = await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: mockValidRequest,
    });

    expect(results).toEqual(expect.arrayContaining([standaloneCase, leadCase]));
    expect(results).toEqual(expect.arrayContaining([memberCase]));
  });

  it('should have an empty filter array if statuses is not defined', async () => {
    await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        judges: [judgeUser.name],
      },
    });

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.query.bool
        .filter,
    ).toEqual([]);
  });
});
