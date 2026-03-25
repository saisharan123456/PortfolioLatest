import http.server
import socketserver

PORT = 3001
Handler = http.server.SimpleHTTPRequestHandler

# Add missing MIME types for Safari compatibility
Handler.extensions_map.update({
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
})

print(f"Serving at http://localhost:{PORT} with WEBP support...")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
