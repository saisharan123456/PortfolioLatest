#!/bin/bash

# Video Compression Script for Cloudinary (100MB limit)
# This script compresses videos to fit Cloudinary's free tier limit

cd "$(dirname "$0")/videos" || exit

echo "🎬 Video Compression for Cloudinary"
echo "Target: < 100MB per video"
echo ""

# Create a backup folder
mkdir -p compressed
echo "✅ Created 'compressed' folder for compressed videos"
echo ""

# Function to compress video
compress_video() {
    local input=$1
    local output="compressed/${input%.mp4}-compressed.mp4"
    local target_size=95  # 95MB to be safe
    
    # Get duration
    duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:noinvert_match=1 "$input" 2>/dev/null)
    
    if [ -z "$duration" ]; then
        echo "⚠️  Could not read duration of $input - skipping"
        return
    fi
    
    # Calculate bitrate needed (in kilobits)
    bitrate=$(echo "scale=0; ($target_size * 1024 * 8) / $duration" | bc)
    
    echo "Compressing: $input"
    echo "  Duration: ${duration%.*}s"
    echo "  Target bitrate: ${bitrate}k"
    
    # Compress with ffmpeg
    ffmpeg -i "$input" -b:v ${bitrate}k -b:a 128k -threads 4 "$output" -y -loglevel quiet
    
    # Check result
    size=$(du -h "$output" | cut -f1)
    echo "  ✅ Done → $size"
    echo ""
}

# Check if ffmpeg exists
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Install with:"
    echo "   brew install ffmpeg"
    exit 1
fi

echo "Processing videos..."
echo ""

for video in *.mp4; do
    current_size=$(du -h "$video" | cut -f1)
    current_bytes=$(du -b "$video" | cut -f1)
    
    # Convert to MB
    current_mb=$((current_bytes / 1024 / 1024))
    
    if [ $current_mb -gt 100 ]; then
        compress_video "$video"
    else
        echo "✅ $video ($current_size) - Already under 100MB"
    fi
done

echo ""
echo "✅ Done! Compressed videos in: compressed/"
echo ""
echo "Next steps:"
echo "1. Upload videos from 'compressed/' folder to Cloudinary"
echo "2. Or upload originals that are < 100MB"
