# DevEfCms.DocumentsApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseDocumentsDocketNumberDocketEntryCompletePut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryCompletePut) | **PUT** /case-documents/{docketNumber}/docket-entry-complete | completes a docket entry on a case that was previously in progress
[**caseDocumentsDocketNumberDocketEntryIdDelete**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdDelete) | **DELETE** /case-documents/{docketNumber}/{docketEntryId} | deletes a document from a case
[**caseDocumentsDocketNumberDocketEntryIdPut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdPut) | **PUT** /case-documents/{docketNumber}/{docketEntryId} | archives a document on a case, but does not delete it
[**caseDocumentsDocketNumberDocketEntryIdSealPut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdSealPut) | **PUT** /case-documents/{docketNumber}/{docketEntryId}/seal | seals a docket entry on a case to the public
[**caseDocumentsDocketNumberDocketEntryIdSignPost**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdSignPost) | **POST** /case-documents/{docketNumber}/{docketEntryId}/sign | creates a copy of an existing document, adds a signature, and adds it to the associated case
[**caseDocumentsDocketNumberDocketEntryIdStrikePut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdStrikePut) | **PUT** /case-documents/{docketNumber}/{docketEntryId}/strike | strike a docket entry on the docket record
[**caseDocumentsDocketNumberDocketEntryIdUnsealPut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdUnsealPut) | **PUT** /case-documents/{docketNumber}/{docketEntryId}/unseal | unseals a docket entry on a case
[**caseDocumentsDocketNumberDocketEntryInProgressPut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryInProgressPut) | **PUT** /case-documents/{docketNumber}/docket-entry-in-progress | updates a current docket entry on a case that is in progress
[**caseDocumentsDocketNumberDocketEntryMetaPut**](DocumentsApi.md#caseDocumentsDocketNumberDocketEntryMetaPut) | **PUT** /case-documents/{docketNumber}/docket-entry-meta | Updates the docket entry meta data on a case
[**caseDocumentsDocketNumberExternalDocumentPost**](DocumentsApi.md#caseDocumentsDocketNumberExternalDocumentPost) | **POST** /case-documents/{docketNumber}/external-document | file a new external document on a case
[**caseDocumentsDocketNumberKeyDocumentDownloadUrlGet**](DocumentsApi.md#caseDocumentsDocketNumberKeyDocumentDownloadUrlGet) | **GET** /case-documents/{docketNumber}/{key}/document-download-url | redirects to the s3 url for downloading a document
[**caseDocumentsDocketNumberKeyDownloadPolicyUrlGet**](DocumentsApi.md#caseDocumentsDocketNumberKeyDownloadPolicyUrlGet) | **GET** /case-documents/{docketNumber}/{key}/download-policy-url | create a pre-signed url for downloads
[**caseDocumentsDocketNumberPaperFilingPost**](DocumentsApi.md#caseDocumentsDocketNumberPaperFilingPost) | **POST** /case-documents/{docketNumber}/paper-filing | file a new paper docket entry on a case
[**caseDocumentsDocketNumberPaperFilingPut**](DocumentsApi.md#caseDocumentsDocketNumberPaperFilingPut) | **PUT** /case-documents/{docketNumber}/paper-filing | updates a current paper docket entry on a case
[**documentsKeyValidatePost**](DocumentsApi.md#documentsKeyValidatePost) | **POST** /documents/{key}/validate | triggers the pdf validation function
[**documentsKeyVirusScanGet**](DocumentsApi.md#documentsKeyVirusScanGet) | **GET** /documents/{key}/virus-scan | gets the status of the virus scan for the document
[**documentsUploadPolicyGet**](DocumentsApi.md#documentsUploadPolicyGet) | **GET** /documents/upload-policy | create a pre-signed url for uploads
[**publicApiDocketNumberKeyPublicDocumentDownloadUrlGet**](DocumentsApi.md#publicApiDocketNumberKeyPublicDocumentDownloadUrlGet) | **GET** /public-api/{docketNumber}/{key}/public-document-download-url | redirects to the s3 url for downloading a public document

<a name="caseDocumentsDocketNumberDocketEntryCompletePut"></a>
# **caseDocumentsDocketNumberDocketEntryCompletePut**
> ModelCase caseDocumentsDocketNumberDocketEntryCompletePut(docketNumber)

completes a docket entry on a case that was previously in progress

Completes a docket entry on a case that was previously in progress. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryCompletePut(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryIdDelete"></a>
# **caseDocumentsDocketNumberDocketEntryIdDelete**
> caseDocumentsDocketNumberDocketEntryIdDelete(docketNumber, docketEntryId)

deletes a document from a case

Deletes a document from a case and from S3. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdDelete(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdPut"></a>
# **caseDocumentsDocketNumberDocketEntryIdPut**
> caseDocumentsDocketNumberDocketEntryIdPut(docketNumber, docketEntryId)

archives a document on a case, but does not delete it

Archives a document on a case, but does not delete it. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdPut(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdSealPut"></a>
# **caseDocumentsDocketNumberDocketEntryIdSealPut**
> DocketEntry caseDocumentsDocketNumberDocketEntryIdSealPut(docketNumber, docketEntryId)

seals a docket entry on a case to the public

Seals a docket entry on a case to the public. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdSealPut(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**DocketEntry**](DocketEntry.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryIdSignPost"></a>
# **caseDocumentsDocketNumberDocketEntryIdSignPost**
> caseDocumentsDocketNumberDocketEntryIdSignPost(docketNumber, docketEntryId)

creates a copy of an existing document, adds a signature, and adds it to the associated case

creates a copy of an existing document, adds a signature, and adds it to the associated case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdSignPost(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdStrikePut"></a>
# **caseDocumentsDocketNumberDocketEntryIdStrikePut**
> ModelCase caseDocumentsDocketNumberDocketEntryIdStrikePut(docketNumber, docketEntryId)

strike a docket entry on the docket record

Strike a docket entry on the docket record. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdStrikePut(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryIdUnsealPut"></a>
# **caseDocumentsDocketNumberDocketEntryIdUnsealPut**
> DocketEntry caseDocumentsDocketNumberDocketEntryIdUnsealPut(docketNumber, docketEntryId)

unseals a docket entry on a case

Unseals a docket entry on a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdUnsealPut(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**DocketEntry**](DocketEntry.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryInProgressPut"></a>
# **caseDocumentsDocketNumberDocketEntryInProgressPut**
> ModelCase caseDocumentsDocketNumberDocketEntryInProgressPut(docketNumber)

updates a current docket entry on a case that is in progress

Updates a docket entry on a case that is in progress. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryInProgressPut(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryMetaPut"></a>
# **caseDocumentsDocketNumberDocketEntryMetaPut**
> ModelCase caseDocumentsDocketNumberDocketEntryMetaPut(docketNumber)

Updates the docket entry meta data on a case

Updates the docket entry meta on a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryMetaPut(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberExternalDocumentPost"></a>
# **caseDocumentsDocketNumberExternalDocumentPost**
> Document caseDocumentsDocketNumberExternalDocumentPost(docketNumber)

file a new external document on a case

Creates a new external document and attaches it to a case. It will also create a work item. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberExternalDocumentPost(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberKeyDocumentDownloadUrlGet"></a>
# **caseDocumentsDocketNumberKeyDocumentDownloadUrlGet**
> caseDocumentsDocketNumberKeyDocumentDownloadUrlGet(docketNumber, key)

redirects to the s3 url for downloading a document

Create and redirects the user to a pre-signed url for document downloads from S3. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let key = "key_example"; // String | 

apiInstance.caseDocumentsDocketNumberKeyDocumentDownloadUrlGet(docketNumber, key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberKeyDownloadPolicyUrlGet"></a>
# **caseDocumentsDocketNumberKeyDownloadPolicyUrlGet**
> PolicyUrl caseDocumentsDocketNumberKeyDownloadPolicyUrlGet(key, docketNumber)

create a pre-signed url for downloads

Create a pre-signed url for  document downloads from S3. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let key = "key_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberKeyDownloadPolicyUrlGet(key, docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **key** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

[**PolicyUrl**](PolicyUrl.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberPaperFilingPost"></a>
# **caseDocumentsDocketNumberPaperFilingPost**
> Document caseDocumentsDocketNumberPaperFilingPost(docketNumber)

file a new paper docket entry on a case

Creates a new paper docket entry/document and attaches it to a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberPaperFilingPost(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberPaperFilingPut"></a>
# **caseDocumentsDocketNumberPaperFilingPut**
> ModelCase caseDocumentsDocketNumberPaperFilingPut(docketNumber)

updates a current paper docket entry on a case

Updates a paper docket entry/document and attaches it to a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberPaperFilingPut(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="documentsKeyValidatePost"></a>
# **documentsKeyValidatePost**
> documentsKeyValidatePost(key)

triggers the pdf validation function

Endpoint that triggers the PDF validation function for the specified document. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let key = "key_example"; // String | 

apiInstance.documentsKeyValidatePost(key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsKeyVirusScanGet"></a>
# **documentsKeyVirusScanGet**
> documentsKeyVirusScanGet(key)

gets the status of the virus scan for the document

Endpoint that the status of the virus scan for the document. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
let key = "key_example"; // String | 

apiInstance.documentsKeyVirusScanGet(key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsUploadPolicyGet"></a>
# **documentsUploadPolicyGet**
> PolicyUrl documentsUploadPolicyGet()

create a pre-signed url for uploads

Create a pre-signed url for  document uploads to S3. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocumentsApi();
apiInstance.documentsUploadPolicyGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PolicyUrl**](PolicyUrl.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="publicApiDocketNumberKeyPublicDocumentDownloadUrlGet"></a>
# **publicApiDocketNumberKeyPublicDocumentDownloadUrlGet**
> publicApiDocketNumberKeyPublicDocumentDownloadUrlGet(docketNumber, key)

redirects to the s3 url for downloading a public document

Create and redirects the user to a pre-signed url for document downloads from S3. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let key = "key_example"; // String | 

apiInstance.publicApiDocketNumberKeyPublicDocumentDownloadUrlGet(docketNumber, key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

