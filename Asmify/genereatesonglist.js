const fs = require('fs');
const path = require('path');

const songsFolder = path.join(__dirname, 'trending');
const outputFile = path.join(__dirname, 'trending.json');

fs.readdir(songsFolder, (err, files) => {
  if (err) {
    console.error('Error reading songs folder:', err);
    return;
  }

  // Filter only .mp3 files
  const songList = files.filter(file => file.endsWith('.mp3'));

  // Add folder path in front of each song
  const songPaths = songList.map(file => `${file}`);

  fs.writeFileSync(outputFile, JSON.stringify(songPaths, null, 2));
  console.log('✅ songs.json file created successfully!');
});
