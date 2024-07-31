// imports
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import axios from 'axios';

// file paths

const privateKeyPath = '/Users/mdemare/.ssh/EU.EORI.NLFLEXTRANS.pem';
const certKeyPath = '/Users/mdemare/.ssh/EU.EORI.NLFLEXTRANS.crt';

// credentials

const YOUR_EORI = "EU.EORI.NLFLEXTRANS"
const THEIR_EORI = "EU.EORI.NLDILSATTEST1"
const AR_EORI = 'EU.EORI.NL000000004';
const pemData = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = crypto.createPublicKey(pemData);
const certificateChainData = fs.readFileSync(certKeyPath, 'utf8');
// Split the certificate chain into individual certificates
const certificates = certificateChainData.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
// Convert each certificate to DER format and then base64 encode it
const x5c = certificates.map(cert => {
  const der = Buffer.from(cert.replace(/-----\w+ CERTIFICATE-----/g, ''), 'base64');
  return der.toString('base64');
});

// URLs
const tokenUrlAssoc = "https://dilsat1-mw.pg.bdinetwork.org/connect/token";
const tokenArUrl = "https://ar.isharetest.net/connect/token";
const delegationArUrl = "https://ar.isharetest.net/delegation";
const partiesUrlAssoc = "https://dilsat1-mw.pg.bdinetwork.org/parties";

// sign JWT payload with default settings
function signJwt(payload) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    x5c: x5c
  };
  return jwt.sign(payload, pemData, { algorithm: 'RS256', expiresIn: "30s", header: header });
}

// decode JWT without signature verification
function decodeJWT(token) {
  // Split the JWT into its three parts: header, payload, and signature
  const parts = token.split('.');
  if (parts.length !== 3) {
      throw new Error('Invalid JWT');
  }

  // Decode the Base64Url encoded payload (second part)
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  // Parse the JSON payload
  return JSON.parse(payload);
}

// create client assertion with default values
function createClientAssertion(token) {
  return new URLSearchParams({
    "grant_type": "client_credentials",
    "scope": "iSHARE",
    "client_id": YOUR_EORI,
    "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    "client_assertion": token
  })
};

let payload = { "iss": YOUR_EORI, "sub": YOUR_EORI, "aud": THEIR_EORI, "jti": uuidv4() }
const token = signJwt(payload);

// Headers for the request
const headers = {
  "accept": "application/json",
  "Content-Type": "application/x-www-form-urlencoded"
};

// Data for the request
const data = createClientAssertion(token);

let responseData;

// association registry /token
let response = await axios.post(tokenUrlAssoc, data, { headers })
console.log(response.status);
console.log(response.data);
let accessToken = response.data['access_token'];

const headersParties = {
  "accept": "application/json",
  "Authorization": "Bearer " + accessToken
};

const params = {
  "active_only": "true",
  "certified_only": "false",
  "adherenceStatus": "Active",
  "framework": "iSHARE",
  "publiclyPublishable": "false",
  "page": "1"
};

// association registry /parties
response = await axios.get(partiesUrlAssoc, { headers: headersParties, params: params })
let partiesToken = response.data['parties_token'];

const decodedPayload = decodeJWT(partiesToken);
console.log(decodedPayload);
let party = decodedPayload["parties_info"]["data"][1];
console.log(party);
let ar = party["authregistery"][0];
console.log(ar);

let arPayload = { "iss": YOUR_EORI, "sub": YOUR_EORI, "aud": AR_EORI, "jti": uuidv4() }

const arToken = jwt.sign(arPayload, pemData, { algorithm: 'RS256', expiresIn: "30s", header: header });

console.log(arToken);


// Headers for the request
const arTokenHeaders = {
  "accept": "application/json",
  "Content-Type": "application/x-www-form-urlencoded"
};

// Data for the request
const arData = createClientAssertion(arToken);

// authorization registry /token
response = await axios.post(tokenArUrl, arData, { arTokenHeaders })
console.log(response.status);
console.log(response.data);
accessToken = response.data['access_token'];
const arHeaders = { "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken }
const policy = {
  "target": {
    "resource": {
      "type": "text",
      "identifiers": [ "text" ],
      "attributes": [ "text" ]
    },
    "actions": [ "text" ]
  },
  "rules": [ { "effect": "text" } ]
};
let body = JSON.stringify({"delegationRequest": {
    "policyIssuer": "text",
    "target": { "accessSubject": "text" },
    "policySets": [ { "policies": [ policy ] } ]
  }})
// authorization registry /delegation
response = await axios.post(delegationArUrl, body, { arHeaders });
