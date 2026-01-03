const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for SPA or missing files: send index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
