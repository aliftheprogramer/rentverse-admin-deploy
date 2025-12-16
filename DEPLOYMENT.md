# Production Deployment Guide

This guide explains how to deploy the Rentverse Admin application to a Linux VPS using Docker Compose.

**Scenario**: The application will run as a Docker container, sitting behind a Reverse Proxy (like Nginx or Apache) running on the host machine. The Reverse Proxy will handle SSL (HMS) and forward traffic to our Docker container.

## Prerequisites

1.  **Linux VPS** (Ubuntu 20.04/22.04 recommended).
2.  **Root/Sudo access** to the server.
3.  **Docker** and **Docker Compose** installed on the server.
4.  **Domain Name** configured to point to your VPS IP address.

## 1. Server Setup

Ensure Docker is installed and running:

```bash
# Update repositories
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose Plugin
sudo apt install docker-compose-plugin
```

## 2. Project Setup

You can either clone the repository or upload the files directly.

```bash
# Example: Clone to /opt/rentverse-admin
cd /opt
git clone <YOUR_REPO_URL> rentverse-admin
cd rentverse-admin
```

If you don't have a git repo, you can use `scp` or `rsync` to upload the project files from your local machine.

## 3. Configure Docker Compose for Proxy

Since we are running behind a proxy, we don't want to expose port 80 to the entire world directly from Docker. We want only our local Nginx to access it.

Modify `docker-compose.yml`:

**Current:**
```yaml
ports:
  - "80:80"
```

**Recommended (Bind to localhost only):**
```yaml
ports:
  - "127.0.0.1:3000:80"
```
*This exposes the container's port 80 to the host's port 3000, but only accessible from localhost.*

## 4. Run the Application

Start the container in detached mode:

```bash
sudo docker compose up --build -d
```

Verify it's running:
```bash
sudo docker compose ps
# STATUS should be "Up"
```

## 5. Configure Host Reverse Proxy (Nginx Example)

Install Nginx on the **host** machine (not inside Docker) if not already installed:

```bash
sudo apt install nginx
```

Create a new site configuration: `/etc/nginx/sites-available/rentverse`

```nginx
server {
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (Certbot can handle this later)
    # listen 443 ssl; 
    
    location / {
        # Forward requests to the Docker container running on port 3000
        proxy_pass http://127.0.0.1:3000;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and test:

```bash
sudo ln -s /etc/nginx/sites-available/rentverse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Setup SSL (HTTPS)

Use Certbot to automatically configure SSL certificates.

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Maintenance

### Updating the App
To deploy a new version:

1.  Pull the latest code:
    ```bash
    git pull origin main
    ```
2.  Rebuild and restart the container:
    ```bash
    sudo docker compose up --build -d
    ```
