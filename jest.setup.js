const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Optional: if you also run into "crypto.subtle is not defined" errors with react-router or other libs:
// const crypto = require('crypto').webcrypto;
// global.crypto = crypto;
