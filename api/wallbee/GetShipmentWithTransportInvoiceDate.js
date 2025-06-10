export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { FROM, TO, username, password } = req.body;

  if (!FROM || !TO || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields (FROM, TO, username, password)' });
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const response = await fetch('https://bookingdk.ntgairocean.com/Api/v1/Booking/GetShipmentWithTransportInvoiceDate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({ FROM, TO })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Fetch failed', error: error.toString() });
  }
}