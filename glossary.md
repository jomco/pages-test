---
title: Glossary
category: 8. Glossary
order: 1
---

Association Registry
- TODO
Authorization Registry
- Holds authorization policies for one or more data owners on access to data
- Also known as **AR-DM, Authorization Registry Data Management**
BDI Association
- Legal entity that serves as an operational anchor for both federated trust/authentication and local onboarding
- A BDI Association is the ‘root association’ for its members
BDI Association Administrator
- Functionary responsible for operating the services of a BDI Association
BDI Association Registry
- Registry of onboarded members
BDI Authentication Processor
- Standard software to make APIs BDI compliant
- Processing of part of protocol: client assertion to token
Business Partners
- Members of other BDI Associations than the root BDI Association
Business Partner Reputation model
- Registry within BDI Association, holding
- Reputation scores of business partners
- Preferred partners
Client Assertion
- TODO
Data Consumer
- Requests access to data and/or Representation Registry and/or Professional Qualification Registry of the data owner
- Controls discovery and endpoints
- Requests subscription to data owner’s Event Pub/Sub Service, receives and evaluates events
Data Licenses
- Descriptions of the terms and conditions for using data
- Either in free form text or in ODRL
Data Owner
- Has control over data and access to data,
- Controls decisions on Data Sovereignty and Trust Sovereignty
- Controls authorization policies, representation rules, professional qualification verification of staff and contactors
- Controls subscription to the Event Pub/Sub Service and publishing of events to subscribers
- Controls discovery and endpoints
- Controls roles assumed by entity
Data Service Provider
- A service provider that acts under the supervision and on behalf of the data owner
Delegation Evidence
- TODO. [See also](https://dev.ishare.eu/delegation/delegation-evidence.html)
Delegation Mask
- TODO. [See also](https://dev.ishare.eu/delegation/delegation-request.html)
Edge agreements
- Standards on interacting with entities and/or persons that have IT systems that are less mature or not BDI-compliant.
- Processes, technology, terms and conditions, liabilities
EORI-ID
- TODO
Event Pub/Sub Service
- Accepts subscription to the data owner’s Event Pub/Sub Service
- Publishes events to subscribers of topics
- Holds proof of the (standard) roles the legal entity assumes
Member
- Legal entity as member of a root BDI Association
Outsider
- Member of a BDI Association other than the root
Policies
- XACML definitions of access policies to data elements
Preferred Business Partners
- Outsiders
- Those who have agreed to the specific terms and conditions of the local BDI Association, which maintains its own Business Partner Reputation Model
Professional Qualifications Registry
- Holds proof of the professional (verifiable) credentials of natural persons in relation to them acting as a representative of a legal entity
Representation Registry
- Holds proof of the mandate of natural persons acting as a representative of a specific legal entity
- Holds proof of the mandate of organizations acting as a representative of a specific legal entity
Visitor
- Outsider with a better reputation score than a set minimum
