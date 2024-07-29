const jwt = require('jsonwebtoken');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const privateKeyPath = '/Users/mdemare/.ssh/EU.EORI.NLFLEXTRANS.pem';
const certKeyPath = '/Users/mdemare/.ssh/EU.EORI.NLFLEXTRANS.crt';
const axios = require('axios');

const YOUR_EORI = "EU.EORI.NLFLEXTRANS"
const THEIR_EORI = "EU.EORI.NLDILSATTEST1"

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificateChainData = fs.readFileSync(certKeyPath, 'utf8');



// Generate a random UUID
const randomUuid = uuidv4();

payload = { "iss": YOUR_EORI, "sub": YOUR_EORI, "aud": THEIR_EORI, "jti": randomUuid }

// Split the certificate chain into individual certificates
const certificates = certificateChainData.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);

// Convert each certificate to DER format and then base64 encode it
const x5c = certificates.map(cert => {
  const der = Buffer.from(cert.replace(/-----\w+ CERTIFICATE-----/g, ''), 'base64');
  return der.toString('base64');
});


// Define the JWT header with the x5c chain
const header = {
  alg: 'RS256',
  typ: 'JWT',
  x5c: x5c
};


const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: "30s", header: header });

console.log(token);


// URL of the endpoint
const tokenUrlAssoc = "https://dilsat1-mw.pg.bdinetwork.org/connect/token";

// Headers for the request
const headers = {
  "accept": "application/json",
  "Content-Type": "application/x-www-form-urlencoded"
};

// Data for the request
const data = new URLSearchParams({
  "grant_type": "client_credentials",
  "scope": "iSHARE",
  "client_id": YOUR_EORI,
  "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  "client_assertion": token
});

let responseData;

// Make the POST request
axios.post(tokenUrlAssoc, data, { headers })
  .then(response => {
    console.log(response.status);
    console.log(response.data);
    responseData = response.data;
    var accessToken = responseData['access_token'];

    partiesUrlAssoc = "https://dilsat1-mw.pg.bdinetwork.org/parties";
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

    axios.get(partiesUrlAssoc, { headers: headersParties, params: params })
      .then(response => {
        console.log(response.status);
        let partiesToken = response.data['parties_token'];
        console.log(partiesToken);
        let parties = jwt.verify(partiesToken, privateKey);
        console.log(parties);
      })
      .catch(error => {
        console.log(error);
        console.error('Error:', error.response ? error.response.data : error.message);
      });

  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
