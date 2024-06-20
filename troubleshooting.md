---
title: Troubleshooting
category: 9. Troubleshooting
order: 1
---

What kind of problems do we want to address here?
Presumably only problems with the software components that we'll deliver.
The basic flow that should be supported is this:

Developer implements resource, configures and runs AssoReg and AuthoReg
To test resource, developer:
- calls AssoReg
- calls AuthoReg
- calls Resource

So troubleshooting might involve:
- AssoReg doesn't start up correctly
- problems making a call to AssoReg
- problems with AssoReg's response
- AuthoReg doesn't start up correctly
- problems making a call to AuthoReg
- problems with AuthoReg's response
- problems with developing Resource to handle AuthoReg's response
