import http.server
import ssl

# Set up the server on port 8000 (can change if needed)
server_address = ('', 8000)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Create an SSL context and wrap the socket
context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain(certfile="server.crt", keyfile="server.key")

# Wrap the HTTP server with SSL
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print("Server running on https://localhost:8000")
httpd.serve_forever()
