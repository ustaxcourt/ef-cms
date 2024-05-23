import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda';

export const handler = (
  awsEvent: CloudFrontRequestEvent,
): CloudFrontRequest => {
  const { request } = awsEvent.Records[0].cf;
  request.uri = `/${[...request.uri.split('/').slice(2)].join('/')}`;
  return request;
};
