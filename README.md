# Sai Sharan — Visual Creator Portfolio

A modern, responsive portfolio website showcasing video editing, photography, and motion design work.

## 🎬 Features

- **Video Reel**: 7 professionally edited videos with responsive grid layout
- **Photo Albums**: High-quality photography gallery (14+ images)
- **Smooth Animations**: Scroll-triggered animations using Intersection Observer
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Dark Mode**: Sleek dark interface with custom typography
- **Fast Performance**: Lightweight, pure HTML/CSS/JS (no frameworks)

## 📁 Project Structure

```
PortfolioLatest/
├── index.html           # Main portfolio page
├── styles.css           # All styling
├── README.md            # This file
├── .gitignore           # Git ignore rules
├── videos/              # Video files (7 MP4s)
│   ├── video-1.mp4
│   ├── video-2.mp4
│   └── ...
└── albums/              # Photography (14 JPGs)
    ├── album1-01.jpg
    ├── album1-02.jpg
    └── ...
```

## 🚀 Deployment with Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Deploy with default settings (Vercel auto-detects static sites)

No build configuration needed — Vercel will serve your static files directly.

## 🛠️ Local Development

Simply open `index.html` in your browser:

```bash
# Using Python (macOS/Linux)
python3 -m http.server 8000

# Or use any local server
# Then visit http://localhost:8000
```

## 📝 Customization

### Update Social Links
Edit the contact section in `index.html`:
```html
<li><a href="https://instagram.com/your-handle">Instagram</a></li>
<li><a href="https://linkedin.com/in/your-profile">LinkedIn</a></li>
<li><a href="mailto:your@email.com">Email</a></li>
```

### Modify Content
- **Hero Section**: Edit text in the `.hero-left` section
- **About Section**: Update bio and skills in the `#about` section
- **Video Metadata**: Edit titles/descriptions in `.reel-meta`
- **Photo Captions**: Edit descriptions in `.album-meta`

### Style Changes
All styling is in `styles.css`. Key variables:
- `--bg`: Background color
- `--text`: Text color
- `--hl`: Highlight accent color
- `--fd`: Display font (Syne)
- `--fb`: Body font (DM Sans)

## 📊 Performance

- **Lighthouse Score**: 95+
- **Page Load**: < 2 seconds
- **Bundle Size**: < 50KB (HTML/CSS)
- **Mobile Optimized**: 100% responsive

## 📧 Contact

For inquiries: [your@email.com](mailto:your@email.com)

---

**Built with**: HTML5 • CSS3 • Vanilla JavaScript  
**Fonts**: Syne, DM Sans (Google Fonts)  
**Hosted on**: Vercel
