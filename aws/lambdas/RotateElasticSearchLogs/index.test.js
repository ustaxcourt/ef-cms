const rotateLogs = require('./index');

/**
 * Returns a mocked response containing a snapshot for the given index name
 *
 * @param {String} indexName the index name for a given date
 * @returns {Object} a success response
 */
function existentSnapshotResponse(indexName) {
  return {
    responseBody: {
      snapshots: [
        {
          data_streams: [],
          duration_in_millis: 174740,
          end_time: '2021-11-24T14:54:33.152Z',
          end_time_in_millis: 1637765673152,
          failures: [],
          include_global_state: true,
          indices: [indexName],
          metadata: {
            taken_because: 'Backup old indices before cleaning up',
            taken_by: 'DAWSON Automated Backups',
          },
          shards: {
            failed: 0,
            successful: 5,
            total: 5,
          },
          snapshot: indexName,
          start_time: '2021-11-24T14:51:38.412Z',
          start_time_in_millis: 1637765498412,
          state: 'SUCCESS',
          uuid: 'F7wAntEdZpPhkQDx1FHoIu',
          version: '7.10.2',
          version_id: 7100299,
        },
      ],
    },
    statusCode: 200,
  };
}

/**
 * Returns a mocked failure response
 *
 * @param {String} indexName the index name for a given date
 * @returns {Object} a failure response
 */
function nonexistentSnapshotResponse(indexName) {
  return {
    responseBody: { message: `Snapshot does not exist for ${indexName}` },
    statusCode: 404,
  };
}

const expiredIndicesResponse = {
  responseBody:
    'green open cwl-2021.07.04' +
    '                                                    ' +
    'kcn_osi9R5Ct7tNY-MYQvQ 5 1  292757    27 251.9mb 125.9mb\n' +
    'green open cwl-2021.07.05' +
    '                                                    ' +
    '4lsXn5EtRX-1N_Dxfy8e7g 5 1  161796     5 191.3mb  95.6mb\n',
  statusCode: 200,
};

const mockContext = {
  fail: res => res,
  success: res => res,
};

describe('getIndexNameForDaysAgo', () => {
  it('should determine the name of the index from 90 days ago', () => {
    const res = rotateLogs.getIndexNameForDaysAgo(90);
    expect(res).toMatch(/^cwl-\d{4}\.\d{2}\.\d{2}$/);
  });
});

describe('getExpiredIndices', () => {
  it('should determine which indices have expired', async () => {
    jest.spyOn(rotateLogs, 'req').mockReturnValueOnce(expiredIndicesResponse);
    const res = await rotateLogs.getExpiredIndices(90);
    expect(res).toEqual(['cwl-2021.07.04', 'cwl-2021.07.05']);
  });
});

describe('snapshotExists', () => {
  it('should find a snapshot that is known to exist', async () => {
    const indexName = 'cwl-2021.07.04';
    jest
      .spyOn(rotateLogs, 'req')
      .mockReturnValueOnce(existentSnapshotResponse(indexName));
    const res = await rotateLogs.snapshotExists(indexName);
    expect(res).toBe(true);
  });
  it('should be unable to find a snapshot that is known to not exist', async () => {
    const indexName = 'cwl-1976.07.04';
    jest
      .spyOn(rotateLogs, 'req')
      .mockReturnValueOnce(nonexistentSnapshotResponse(indexName));
    const res = await rotateLogs.snapshotExists(indexName);
    expect(res).toBe(false);
  });
});

describe('snapshotForIndexName', () => {
  it('should generate a snapshot if none exists', async () => {
    const indexName = 'cwl-2021.07.04';
    jest
      .spyOn(rotateLogs, 'req')
      .mockReturnValueOnce(nonexistentSnapshotResponse(indexName))
      .mockReturnValueOnce({
        responseBody: { message: `Snapshot in progress for ${indexName}` },
        statusCode: 200,
      });
    const res = await rotateLogs.snapshotForIndexName(indexName);
    expect(rotateLogs.req).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(200);
  });
  it('should not generate a snapshot if one already exists', async () => {
    const indexName = 'cwl-2021.07.04';
    jest
      .spyOn(rotateLogs, 'req')
      .mockReturnValueOnce(existentSnapshotResponse(indexName));
    const res = await rotateLogs.snapshotForIndexName(indexName);
    expect(rotateLogs.req).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(412);
  });
});

describe('deleteIndices', () => {
  it('should not delete indices if a snapshot does not exist', async () => {
    const indexName = 'cwl-2021.07.04';
    jest
      .spyOn(rotateLogs, 'req')
      .mockReturnValueOnce(nonexistentSnapshotResponse(indexName));
    const res = await rotateLogs.deleteIndices(indexName);
    expect(rotateLogs.req).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(404);
  });
  it('should delete indices if a snapshot exists', async () => {
    const indexName = 'cwl-2021.07.04';
    jest
      .spyOn(rotateLogs, 'req')
      .mockReturnValueOnce(existentSnapshotResponse(indexName))
      .mockReturnValueOnce({
        responseBody: { message: `Deleting indices for ${indexName}` },
        statusCode: 200,
      });
    const res = await rotateLogs.deleteIndices(indexName);
    expect(rotateLogs.req).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(200);
  });
});

describe('handler', () => {
  it(
    "should generate snapshots for expired indices that don't" +
      'have them and delete expired indices that do',
    async () => {
      // expect that the 7/4/21 indices should be deleted
      // and that a snapshot should be created for the 7/5/21 indices
      const expectedResult = {
        createSnapshot: [
          {
            indexName: 'cwl-2021.07.05',
            responseBody: {
              message: 'Snapshot in progress for cwl-2021.07.05',
            },
            statusCode: 200,
          },
        ],
        deleteIndices: [
          {
            indexName: 'cwl-2021.07.04',
            responseBody: {
              message: 'Deleting indices for cwl-2021.07.04',
            },
            statusCode: 200,
          },
        ],
      };

      // spy on all the methods that will be called
      jest
        .spyOn(rotateLogs, 'req')
        .mockReturnValueOnce(expiredIndicesResponse)
        .mockReturnValueOnce(existentSnapshotResponse('cwl-2021.07.04'))
        .mockReturnValueOnce(existentSnapshotResponse('cwl-2021.07.04'))
        .mockReturnValueOnce({
          responseBody: { message: 'Deleting indices for cwl-2021.07.04' },
          statusCode: 200,
        })
        .mockReturnValueOnce(nonexistentSnapshotResponse('cwl-2021.07.05'))
        .mockReturnValueOnce(nonexistentSnapshotResponse('cwl-2021.07.05'))
        .mockReturnValueOnce({
          responseBody: { message: 'Snapshot in progress for cwl-2021.07.05' },
          statusCode: 200,
        });
      jest.spyOn(rotateLogs, 'getExpiredIndices');
      jest.spyOn(rotateLogs, 'snapshotExists');
      jest.spyOn(rotateLogs, 'deleteIndices');
      jest.spyOn(rotateLogs, 'snapshotForIndexName');

      // run the rotation job and verify the results
      const res = await rotateLogs.handler(mockContext);
      expect(rotateLogs.req).toHaveBeenCalledTimes(7);
      expect(rotateLogs.getExpiredIndices).toHaveBeenCalledTimes(1);
      expect(rotateLogs.snapshotExists).toHaveBeenCalledTimes(4);
      expect(rotateLogs.deleteIndices).toHaveBeenCalledTimes(1);
      expect(rotateLogs.deleteIndices).toHaveBeenCalledWith('cwl-2021.07.04');
      expect(rotateLogs.snapshotForIndexName).toHaveBeenCalledTimes(1);
      expect(rotateLogs.snapshotForIndexName).toHaveBeenCalledWith(
        'cwl-2021.07.05',
      );
      expect(res).toEqual(JSON.stringify(expectedResult));
    },
  );
});
