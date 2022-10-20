# DevEfCms.DocketentriesApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseDocumentsDocketNumberMotionDocketEntryIdStampPost**](DocketentriesApi.md#caseDocumentsDocketNumberMotionDocketEntryIdStampPost) | **POST** /case-documents/{docketNumber}/{motionDocketEntryId}/stamp | creates a stamped order.

<a name="caseDocumentsDocketNumberMotionDocketEntryIdStampPost"></a>
# **caseDocumentsDocketNumberMotionDocketEntryIdStampPost**
> caseDocumentsDocketNumberMotionDocketEntryIdStampPost(docketNumber, motionDocketEntryId)

creates a stamped order.

creates a stamped order. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DocketentriesApi();
let docketNumber = "docketNumber_example"; // String | 
let motionDocketEntryId = "motionDocketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberMotionDocketEntryIdStampPost(docketNumber, motionDocketEntryId, (error, data, response) => {
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
 **motionDocketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

