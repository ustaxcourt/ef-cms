import { GetSendStatisticsCommand, type SESClient } from '@aws-sdk/client-ses';
export const getSesStatus = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<boolean> => {
  const sesClient: SESClient = applicationContext.getEmailClient();
  const HOURS_TO_MONITOR = 24;
  const cmd = new GetSendStatisticsCommand();
  const { SendDataPoints } = await sesClient.send(cmd);
  const numberOfDataPoints = HOURS_TO_MONITOR * 4; // each data point is a 15 minute increment
  const sesHealth = SendDataPoints?.slice(0, numberOfDataPoints).every(
    ({ Rejects }) => Rejects === 0,
  );
  if (sesHealth === undefined) {
    console.warn('SES::GetSendStatisticsCommand returned no data');
    return true;
  }
  return sesHealth;
};
