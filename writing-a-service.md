---
title: Writing a service
category: 7. Writing a service
order: 1
---

To extend a service provider API and make it iSHARE compatible, you will need to take an existing HTTP service and add a /token endpoint to it, which will first check whether the client assertion in the request is valid and addressed to you. You will perform get a token from the Association Registry, and then use it to perform a /party call there to lookup information on the client based on the client id included in the client assertion. If the party information shows that the client is compliant, then you can return a token to the client.

Also, you'll have to extend all API calls with a check to see whether they include a valid token in the header, and also a check to see if they include a delegation evidence JWT. That JWT should be valid (right sender and recipient, and signed correctly) and the policies in its payload should allow access to the current API call.

If all that is correct, the API call may proceed.
