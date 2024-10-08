import { ServerApplicationContext } from '@web-api/applicationContext';
import { SubmitJobCommand, SubmitJobCommandInput } from '@aws-sdk/client-batch';

export const sendZipperBatchJob = async (
  applicationContext: ServerApplicationContext,
  documents: {
    key: string;
    filePathInZip: string;
    useTempBucket: boolean;
  }[],
  zipName: string,
  clientConnectionId: string,
  userId: string,
) => {
  const [currentConnection] = (
    await applicationContext
      .getPersistenceGateway()
      .getWebSocketConnectionsByUserId({
        applicationContext,
        userId,
      })
  ).filter(connection => {
    return connection.clientConnectionId === clientConnectionId;
  });
  //check if connection was fetched or handle not found
  const { connectionId } = currentConnection;

  const { currentColor, efcmsDomain, region, stage } =
    applicationContext.environment;
  const awsRegion = region as 'us-east-1' | 'us-west-1';
  const params: SubmitJobCommandInput = {
    containerOverrides: {
      environment: [
        {
          name: 'WEBSOCKET_CONNECTION_ID',
          value: connectionId,
        },
        {
          name: 'WEBSOCKET_REGION',
          value: awsRegion,
        },
        {
          name: 'EFCMS_DOMAIN',
          value: efcmsDomain,
        },
        {
          name: 'STAGE',
          value: stage,
        },
        {
          name: 'DOCKET_ENTRY_FILES',
          value: JSON.stringify(documents),
        },
        {
          name: 'ZIP_FILE_NAME',
          value: zipName,
        },
      ],
    },
    jobDefinition: `s3-zip-job-${stage}-${currentColor}-${awsRegion}`,
    jobName: `batch-docket-entries-download-${Date.now()}`,
    jobQueue: `aws-batch-job-queue-${stage}-${currentColor}-${awsRegion}`,
  };

  const command = new SubmitJobCommand(params);
  await applicationContext.getBatchClient(awsRegion).send(command);
};
