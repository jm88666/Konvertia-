const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');

async function unzipSession() {
  const zipPath = path.join(__dirname, 'session.zip');
  const extractPath = path.join(__dirname, 'session');

  if (fs.existsSync(zipPath)) {
    console.log('📦 Session ZIP gevonden. Bezig met uitpakken...');
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();
    console.log('✅ Session uitgepakt naar /session');
  } else {
    console.log('⚠️ Geen session.zip gevonden');
  }
}

unzipSession();
