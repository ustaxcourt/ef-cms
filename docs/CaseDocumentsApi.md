# DevEfCms.CaseDocumentsApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseDocumentsDocketEntryIdAppendPdfPost**](CaseDocumentsApi.md#caseDocumentsDocketEntryIdAppendPdfPost) | **POST** /case-documents/{docketEntryId}/append-pdf | appends a form pdf to the document with the corresponding docketEntryId
[**caseDocumentsDocketNumberDocketEntryIdRemovePdfPost**](CaseDocumentsApi.md#caseDocumentsDocketNumberDocketEntryIdRemovePdfPost) | **POST** /case-documents/{docketNumber}/{docketEntryId}/remove-pdf | deletes the pdf from a given docket entry
[**caseDocumentsDocumentContentsIdDocumentContentsGet**](CaseDocumentsApi.md#caseDocumentsDocumentContentsIdDocumentContentsGet) | **GET** /case-documents/{documentContentsId}/document-contents | retrieves document contents for a given document contents id
[**caseDocumentsOrderSearchGet**](CaseDocumentsApi.md#caseDocumentsOrderSearchGet) | **GET** /case-documents/order-search | search for an order-related document type by keyword within its title or contents
[**publicApiTodaysOpinionsGet**](CaseDocumentsApi.md#publicApiTodaysOpinionsGet) | **GET** /public-api/todays-opinions | returns the opinions created for the current date
[**publicApiTodaysOrdersPageSortOrderGet**](CaseDocumentsApi.md#publicApiTodaysOrdersPageSortOrderGet) | **GET** /public-api/todays-orders/{page}/{sortOrder} | returns the orders served on the current date

<a name="caseDocumentsDocketEntryIdAppendPdfPost"></a>
# **caseDocumentsDocketEntryIdAppendPdfPost**
> Document caseDocumentsDocketEntryIdAppendPdfPost(docketEntryId)

appends a form pdf to the document with the corresponding docketEntryId

Appends a form pdf to the document with the corresponding docketEntryId. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDocumentsApi();
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketEntryIdAppendPdfPost(docketEntryId, (error, data, response) => {
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
 **docketEntryId** | **String**|  | 

### Return type

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryIdRemovePdfPost"></a>
# **caseDocumentsDocketNumberDocketEntryIdRemovePdfPost**
> Document caseDocumentsDocketNumberDocketEntryIdRemovePdfPost(docketNumber, docketEntryId)

deletes the pdf from a given docket entry

Deletes the pdf from a given docket entry 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDocumentsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdRemovePdfPost(docketNumber, docketEntryId, (error, data, response) => {
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

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocumentContentsIdDocumentContentsGet"></a>
# **caseDocumentsDocumentContentsIdDocumentContentsGet**
> DocumentContents caseDocumentsDocumentContentsIdDocumentContentsGet(documentContentsId)

retrieves document contents for a given document contents id

Retrieves document&#x27;s contents from S3 for a given ID. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDocumentsApi();
let documentContentsId = "documentContentsId_example"; // String | 

apiInstance.caseDocumentsDocumentContentsIdDocumentContentsGet(documentContentsId, (error, data, response) => {
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
 **documentContentsId** | **String**|  | 

### Return type

[**DocumentContents**](DocumentContents.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsOrderSearchGet"></a>
# **caseDocumentsOrderSearchGet**
> Document caseDocumentsOrderSearchGet()

search for an order-related document type by keyword within its title or contents

Search for an order-related document type by keyword within its title or contents. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDocumentsApi();
apiInstance.caseDocumentsOrderSearchGet((error, data, response) => {
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

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="publicApiTodaysOpinionsGet"></a>
# **publicApiTodaysOpinionsGet**
> Document publicApiTodaysOpinionsGet()

returns the opinions created for the current date

Returns the opinions created for the current date. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDocumentsApi();
apiInstance.publicApiTodaysOpinionsGet((error, data, response) => {
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

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="publicApiTodaysOrdersPageSortOrderGet"></a>
# **publicApiTodaysOrdersPageSortOrderGet**
> Document publicApiTodaysOrdersPageSortOrderGet(page, sortOrder)

returns the orders served on the current date

Returns the orders served on the current date. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDocumentsApi();
let page = "page_example"; // String | 
let sortOrder = "sortOrder_example"; // String | 

apiInstance.publicApiTodaysOrdersPageSortOrderGet(page, sortOrder, (error, data, response) => {
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
 **page** | **String**|  | 
 **sortOrder** | **String**|  | 

### Return type

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

