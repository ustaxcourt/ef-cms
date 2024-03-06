Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Deploy Blue/green east/west public/private
- update all async lambdas to use generic async work flow
- Figure out deployments + integration with terraform
- Add correct environment variables.
- custom domains
- Some routes require an authorizer, others do not. /auth an 


::: Discussion :::
- Should sst rely on terraform resources or should terraform rely on sst resources? (sst deploy -> terraform deploy)