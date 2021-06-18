# Security

We use a strict Content Security Policy to protect the site against attacks. Parts of the CSP are not as strict as we would like and can possibly be improved on later with dependency upgrades.

`script-src` and `style-src` both allow `unsafe-inline` due to the Dynamsoft library used by internal users for scanning paper documents.

Dynamsoft has documented the issue:

https://developer.dynamsoft.com/dwt/kb/distribution-deployment/dynamic-web-twain-content-security-policy

https://developer.dynamsoft.com/dwt/kb/distribution-deployment/dynamic-web-twain-content-security-policy-violated

If Dynamsoft provides developers with an option to disable inline scripts and styles, `unsafe-inline` can be removed from our CSP.
