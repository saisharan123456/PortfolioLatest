#!/usr/bin/env node

/**
 * Upload videos to Vercel Blob
 * 
 * Usage:
 * 1. Set BLOB_READ_WRITE_TOKEN environment variable:
 *    export BLOB_READ_WRITE_TOKEN="your-token-here"
 * 
 * 2. Run this script:
 *    node upload-videos.js
 * 
 * Videos will be uploaded to:
 * https://your-project.blob.vercel-storage.com/video-1.mp4
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const VIDEOS_DIR = path.join(__dirname, 'videos');

if (!BLOB_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable not set');
  console.error('Set it with: export BLOB_READ_WRITE_TOKEN="your-token"');
  process.exit(1);
}

async function uploadVideoToBlob(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'blob.vercel-storage.com',
      path: `/${fileName}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${BLOB_TOKEN}`,
        'Content-Type': 'video/mp4',
        'Content-Length': fileBuffer.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          resolve(json.url);
        } else {
          reject(new Error(`Upload failed: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

async function uploadAllVideos() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error('❌ videos/ folder not found');
    process.exit(1);
  }

  const videos = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'));
  
  if (videos.length === 0) {
    console.error('❌ No MP4 files found in videos/ folder');
    process.exit(1);
  }

  console.log(`📹 Found ${videos.length} videos. Starting upload...`);
  console.log('');

  const urls = {};

  for (const video of videos) {
    const filePath = path.join(VIDEOS_DIR, video);
    const fileSize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
    
    try {
      process.stdout.write(`⏳ Uploading ${video} (${fileSize}MB)... `);
      const url = await uploadVideoToBlob(filePath, video);
      urls[video] = url;
      console.log('✅ Done');
    } catch (error) {
      console.error(`❌ Failed: ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All videos uploaded!\n');
  console.log('URLs to use in index.html:');
  console.log('');
  
  Object.entries(urls).forEach(([name, url]) => {
    console.log(`${name}:`);
    console.log(`  ${url}`);
    console.log('');
  });

  // Save URLs to a file for reference
  fs.writeFileSync(
    path.join(__dirname, 'VIDEO_URLS.json'),
    JSON.stringify(urls, null, 2)
  );
  console.log('Saved URLs to VIDEO_URLS.json');
}

uploadAllVideos();
