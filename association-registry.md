---
title: Association Registry
category: 4. Components
order: 2
---

The Association Registry, unlike the Authorization Registry, is a registry run by a central authority. It contains a list of authorized participants in an iSHARE Data Space. For each listed participant, it stores their current compliance status, the time frame during which that status applies, their endpoint, and a list of Authorization Registries that manage access to the participants. It also contains additional information, including legal details such as agreements.

To interact with an Association Registry, clients first need to obtain a token by sending a message containing their ID, among other details, and signing it with their private key. This message is called a Client Assertion. The Association Registry will use the supplied ID to look up the client's public key. With the public key, it will verify the signature. If the signature is valid and the client's current status is active, the registry will generate a token, store it internally along with an expiration date, and send it to the client.

With this token, clients may use the API of the Association Registry. Using the [parties API-call](https://dev.ishare.eu/satellite/parties.html#request), clients may access data of a specific party, specified by their [EORI-id](glossary.id#EORI).

##### Core Functions of the Association Registry

###### Compliance Status Management

- Compliance Status: Tracks whether a participant meets the required standards and protocols set by iSHARE.
- Validity Period: Indicates the time frame during which the compliance status is valid. This helps ensure that participants are regularly reviewed and re-validated.

###### Participant Endpoints
- Stores the endpoint information of each participant, enabling other participants to discover and interact with them directly.

###### Authorization Registry References
- Lists the Authorization Registries associated with each participant. These registries manage detailed access control policies and permissions for data sharing.

###### Legal and Contractual Information
- Contains agreements and legal documents that outline the terms of participation and data sharing. This ensures transparency and legal compliance among participants.
