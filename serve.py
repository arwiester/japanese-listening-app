#!/usr/bin/env python3
"""
Simple HTTP server for Japanese Numbers app
Run this script, then open: http://localhost:8000
"""

import http.server
import socketserver
import os

PORT = 8000

# Change to the directory where the HTML file is
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

# Add CORS headers to allow API calls
class CORSRequestHandler(Handler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"✅ Server running at http://localhost:{PORT}")
    print(f"📱 Open this URL in your browser: http://localhost:{PORT}/japanese-numbers.html")
    print(f"⏹️  Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped")
