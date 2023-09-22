export const getSesStatus = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<boolean> => {
  const SES = applicationContext.getEmailClient();
  const HOURS_TO_MONITOR = 24;
  const { SendDataPoints } = await SES.getSendStatistics({}).promise();
  const numberOfDataPoints = HOURS_TO_MONITOR * 4; // each data point is a 15 minute increment
  const sesHealth = SendDataPoints.slice(0, numberOfDataPoints).every(
    ({ Rejects }) => Rejects === 0,
  );

  return sesHealth;
};
