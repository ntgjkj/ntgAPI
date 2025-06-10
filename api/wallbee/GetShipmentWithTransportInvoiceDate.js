const https = require('https');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { FROM, TO, username, password } = req.body;

  if (!FROM || !TO || !username || !password) {
    return res.status(400).json({ message: 'Missing FROM, TO, username or password' });
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const postData = JSON.stringify({ FROM, TO });

  const options = {
    hostname: 'bookingdk.ntgairocean.com',
    path: '/Api/v1/Booking/GetShipmentWithTransportInvoiceDate',
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'PostmanRuntime/7.44.0',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    }
  };

  const request = https.request(options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.status(apiRes.statusCode).send(data);
    });
  });

  request.on('error', (error) => {
    console.error('Request failed:', error);
    res.status(500).json({ error: 'Request to NTG failed', details: error.toString() });
  });

  request.write(postData);
  request.end();
}
