# DevEfCms.OrderSearchApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**publicApiOrderSearchGet**](OrderSearchApi.md#publicApiOrderSearchGet) | **GET** /public-api/order-search | search for an order-related document type by keyword within its title or contents

<a name="publicApiOrderSearchGet"></a>
# **publicApiOrderSearchGet**
> Document publicApiOrderSearchGet()

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

let apiInstance = new DevEfCms.OrderSearchApi();
apiInstance.publicApiOrderSearchGet((error, data, response) => {
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

