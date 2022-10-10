### Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

#### axios

`axios` has a major update available to ^1.0.0 but there are breaking changes and no associated upgrade guide as of writing this. See [this issue](https://github.com/axios/axios/issues/5014). Seems like as of now, there are still quite a few issues popping up with this major update so it may be worthwhile to wait a few days until those are ironed out.

#### puppeteer / puppeteer-core

`puppeteer` and `puppeteer-core` have a major version update to ^18.x.x, but they need to stay at the same major version as `chrome-aws-lambda` (17.1.3). If we upgrade `puppeteer`, we see a ` cannot read property 'prototype' of undefined` error. 

#### s3rver

Check if there are updates to `s3rver` above version [3.7.1](https://www.npmjs.com/package/s3rver).
- Why is there a patch called `s3rver+3.7.1.patch`?
    - To address the high severity issue exposed by `s3rver`'s dependency on `busboy` 0.3.1, which relies on `dicer` that actually has the [security issue](https://github.com/advisories/GHSA-wm7h-9275-46v2). Unfortunately, `busboy` ^0.3.1 is incompatible with s3rver which is why there's a patch in place to make it compatible.
- How does the patch run?
    - This runs as part of the `npm postinstall` step.