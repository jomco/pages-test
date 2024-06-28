---
title: Troubleshooting
category: 9. Troubleshooting
order: 1
---

Problems while using the components (Association Registry and Authorization Registry) provided on this site.

#### Basic Flow

The basic flow that should be supported is this:

Developer implements resource, configures and runs Association Registry and Authorization Registry
To test resource, developer:
- calls Association Registry
- calls Authorization Registry
- calls Resource

#### Types Of Problems

So troubleshooting might involve:
- Association Registry doesn't start up correctly
- problems making a call to Association Registry
- problems with Association Registry's response
- Authorization Registry doesn't start up correctly
- problems making a call to Authorization Registry
- problems with Authorization Registry's response
- problems with developing Resource to handle Authorization Registry's response
