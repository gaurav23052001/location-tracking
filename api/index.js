const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Allow CORS for all origins (*)
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  return req.socket.remoteAddress.replace('::ffff:', '');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/report', (req, res) => {
  const ip = getClientIp(req);
  
  const { latitude, longitude, accuracy } = req.body || {};
  const info = {
    ip,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    accuracy: accuracy ?? null,
    receivedAt: new Date().toISOString()
  };

  console.log('VISITOR INFO:', info);
  res.json({ success: true, info });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
