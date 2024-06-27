---
title: Service Consumer
category: 4. Components
order: 5
class: todo
---

The ultimate goal of the Service Consumer is to access a resource at a Service Provider, but in order to do so, a number of other actions need to be performed first.

- The Service Consumer should be familiar with the exposed API of the Service Provider, since there is no standard for Service Provider APIs. So the consumer should be able to create an HTTP request that conforms to the API.
- That HTTP request also needs a Delegation Evidence JWT to be accepted by the Service Provider. Usually these are added as a HTTP Request Header. This JWT proves that you are authorized to perform certain actions on certain resources as described in the Delegation Evidence JWT.
- Another necessary HTTP Request Header is a Bearer Token. This proves that you are who you say you are.
- To get the Bearer Token, you must perform a token call on the Service Provider, passing a [Client Assertion](glossary.md#client-assertion) to them, which is a statement about your identity signed with your private key, and the resource you wish to access, specified by a resource identifier, which you should know.
- To get the Delegation Evidence, you must first call the delegation evidence on the Authorization Registry, which will return a (signed) Delegation Evidence JWT.
- In order to make this call, the consumer need the URL of the Authorization Registry (AR), a Bearer Token for the AR, and a Delegation Mask. The Delegation Mask is a JSON object which specifies which resource they wish to access, and which permissions they need.
- To get the Bearer Token, the consumer must perform a token call on the AR, passing a client assertion to them, containing the IDs of the consumer and the AR
- To get the ID and the URL of the AR, the Service Consumer should perform a `/parties` call on the Association Registry. To make that call, the consumer will need the ID and URL of the association register, the Service Provider ID, and a Bearer Token.
- To get the Bearer Token, the consumer must perform a token call on the Association Registry, passing a client assertion to them, containing the IDs of the consumer and the Association Registry.

TODO Add sequence diagram
