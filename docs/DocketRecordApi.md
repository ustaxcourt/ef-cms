# DevEfCms.DocketRecordApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseDocumentsDocketNumberDocketEntryMetaPut**](DocketRecordApi.md#caseDocumentsDocketNumberDocketEntryMetaPut) | **PUT** /case-documents/{docketNumber}/docket-entry-meta | Updates the docket entry meta data on a case

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

let apiInstance = new DevEfCms.DocketRecordApi();
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

