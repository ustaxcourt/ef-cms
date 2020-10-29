exports.getSesStatus = async ({ applicationContext }) => {
  const SES = applicationContext.getEmailClient();
  const HOURS_TO_MONITOR = 24;
  const { SendDataPoints } = await SES.getSendStatistics({}).promise();
  const numberOfDataPoints = HOURS_TO_MONITOR * 4; // each data point is a 15 minute increment
  return SendDataPoints.slice(0, numberOfDataPoints).every(
    ({ Rejects }) => Rejects === 0,
  );
};
