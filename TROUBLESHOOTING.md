### Serverless 1.61.1

We needed to lock the serverless file down to 1.61.1 because it throws this error when trying to do deploys

```
Domain Manager: UnknownEndpoint: Inaccessible host: `acm.undefined.amazonaws.com'. This service may not be available in the `us-east-1' region.
Serverless: [AWS apigatewayv2 undefined 0s 0 retries] getDomainName({ DomainName: 'efcms-dev.ustc-case-mgmt.flexion.us' })
Serverless: [AWS acm undefined 0.476s 3 retries] listCertificates({
  CertificateStatuses: [ 'PENDING_VALIDATION', 'ISSUED', 'INACTIVE', [length]: 3 ]
})
```

### serverless-domain-manager

This is pointing to our own fork which includes the functionality required to host web socket endpoints.  The current state of serverless-domain-manager does not support web sockets.


### serverless-s3-local and s3rver

These libraries were forked to support multipart file uploads to s3 local.