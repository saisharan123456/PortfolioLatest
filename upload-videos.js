#!/usr/bin/env node

/**
 * Upload videos to Cloudflare R2
 * 
 * Usage:
 * 1. Create a .env file and set the required variables (see .env.example)
 * 2. Run this script:
 *    node upload-videos.js
 * 
 * Videos will be uploaded to your Cloudflare R2 bucket.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Load environment variables
const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ Error: Missing required Cloudflare R2 environment variables.');
  console.error('Make sure you have created a .env file based on .env.example.');
  process.exit(1);
}

const VIDEOS_DIR = path.join(__dirname, 'videos');

// Initialize S3 Client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadVideoToR2(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: 'video/mp4',
  });

  try {
    await s3Client.send(command);
    // Return the public URL if configured, otherwise the object key
    if (R2_PUBLIC_URL) {
      // Remove trailing slash if present
      const baseUrl = R2_PUBLIC_URL.replace(/\/$/, '');
      return `${baseUrl}/${fileName}`;
    }
    return fileName;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
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

  console.log(`📹 Found ${videos.length} videos. Starting upload to Cloudflare R2...`);
  console.log('');

  const urls = {};

  for (const video of videos) {
    const filePath = path.join(VIDEOS_DIR, video);
    const fileSize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
    
    try {
      process.stdout.write(`⏳ Uploading ${video} (${fileSize}MB)... `);
      const url = await uploadVideoToR2(filePath, video);
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
