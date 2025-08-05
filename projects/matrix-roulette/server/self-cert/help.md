1. Install mkcert globally (if not already)

# On Windows (PowerShell as Admin)
```bash
choco install mkcert
mkcert -install
```
2. Generate certs for localhost once (project root)
```bash
mkcert localhost
```

This creates:

localhost.pem (cert)
localhost-key.pem (private key)