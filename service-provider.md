---
title: Service Provider
category: 4. Components
order: 4
---

A Service Provider can be any API, with three additions:

First, any protected call must check if there is a valid Bearer Token in the header. All calls with invalid or missing tokens are refused.
Second, there should be an endpoint to distribute tokens based on [Client Assertions](glossary#client-assertion). All callers with a valid client assertion get a token which grants access for a specified period of time.
Finally, any protected call must also check the delegation evidence JWT in the request header. Any calls with missing or invalid JWTs are refused. In addition, the permissions granted in the JWT must grant access to the actual request being made. It is the responsibility of the Service Provider to implement this check, which will be different for every Service Provider, and to implement a mapping between the policies in the JWT and the shape of their own API.
