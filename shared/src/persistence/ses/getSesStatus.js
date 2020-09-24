exports.getSesStatus = async ({ applicationContext }) => {
  const SES = applicationContext.getEmailClient();
  const HOURS_TO_MONITOR = 24;
  const { SendDataPoints } = await SES.getSendStatistics({}).promise();
  const numberOfDatPoints = HOURS_TO_MONITOR * 4; // each data point is a 15 minute increment
  return SendDataPoints.slice(0, numberOfDatPoints).every(
    ({ Bounces, Complaints, Rejects }) =>
      Bounces === 0 && Complaints === 0 && Rejects === 0,
  );
};
