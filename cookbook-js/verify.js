// requires
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const axios = require('axios');
const forge = require('node-forge');

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



let certBase64 = x5c[0];
const certDer = Buffer.from(certBase64, 'base64');
const certPem = forge.pki.certificateToPem(forge.pki.certificateFromAsn1(forge.asn1.fromDer(certDer.toString('binary'))));

let payload = { "iss": YOUR_EORI, "sub": YOUR_EORI, "aud": THEIR_EORI, "jti": uuidv4() }
const token = signJwt(payload);
console.log(certPem);
const decoded = jwt.verify(token, certPem);
console.log(decoded);

function validateCertificateChain(certificates) {
  try {
    for (let i = 0; i < certificates.length - 1; i++) {
      const subjectCert = certificates[i];
      const issuerCert = certificates[i + 1];

      // Create a CA store with just the issuer certificate
      const caStore = forge.pki.createCaStore([issuerCert]);

      // Verify the current certificate against the issuer
      const isValid = forge.pki.verifyCertificateChain(caStore, [subjectCert]);
      if (!isValid) {
        console.error(`Certificate ${i} failed to validate against its issuer.`);
        return false;
      }
    }

    // Optionally, verify that the root certificate is self-signed
    const rootCert = certificates[certificates.length - 1];
    if (!rootCert.verify(rootCert)) {
      console.error('Root certificate is not self-signed.');
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error during certificate chain validation:', err.message);
    return false;
  }
}

const certs = x5c.map(certBase64 => {
  const certDer = forge.util.decode64(certBase64);
  const asn1Obj = forge.asn1.fromDer(certDer);
  return forge.pki.certificateFromAsn1(asn1Obj);
});

console.log("certificates valid: " + validateCertificateChain(certs));
