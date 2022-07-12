exports.handler = (event, context) => {
  console.log('event', event);
  console.log('context', context);
  const { docketNumber, jobId, trialSessionId } = event;

  // TODO: read in event
  // run set notice interactor

  // TODO: some how run the logic of setNoticeForCase found in: shared/src/business/useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor.js
  // we could copy that code directly in here if we wanted

  // TODO: save the PDF to s3 somewhere in temp bucket

  // TODO: update dynamo's jobId entry when finished with this docketNumber
};
