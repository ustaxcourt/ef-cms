# DevEfCms.OpinionSearchApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**publicApiOpinionSearchGet**](OpinionSearchApi.md#publicApiOpinionSearchGet) | **GET** /public-api/opinion-search | search for an opinion-related document type by keyword within its title or contents

<a name="publicApiOpinionSearchGet"></a>
# **publicApiOpinionSearchGet**
> Document publicApiOpinionSearchGet()

search for an opinion-related document type by keyword within its title or contents

Search for an opinion-related document type by keyword within its title or contents. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.OpinionSearchApi();
apiInstance.publicApiOpinionSearchGet((error, data, response) => {
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

