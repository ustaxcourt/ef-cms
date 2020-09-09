exports.getSesStatus = async ({ applicationContext }) => {
  const SES = applicationContext.getEmailClient();

  try {
    const { SendDataPoints } = await SES.getSendStatistics({}).promise();
    return SendDataPoints.every(
      ({ Bounces, Complaints, Rejects }) =>
        Bounces === 0 && Complaints === 0 && Rejects === 0,
    );
  } catch (err) {
    console.log('error sending the ses email', err);
    return false;
  }
};
