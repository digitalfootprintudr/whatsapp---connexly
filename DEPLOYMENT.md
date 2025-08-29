# 🚀 WhatsApp Connexly Platform Deployment Guide

This guide will help you deploy the WhatsApp Chat Platform to a production web server for testing real-time WhatsApp functionality.

## 📋 Prerequisites

- Docker and Docker Compose installed
- A domain name (for production) or localhost (for testing)
- WhatsApp Business API credentials from Meta
- Basic knowledge of server administration

## 🏗️ Architecture Overview

The platform consists of:
- **Web Application**: Next.js frontend and API
- **Database**: PostgreSQL for data storage
- **Cache/Queue**: Redis for sessions and job queues
- **Reverse Proxy**: Nginx for SSL termination and load balancing
- **Worker**: Background job processing

## 🚀 Quick Start (Local Testing)

### 1. Generate SSL Certificates
```bash
./generate-ssl.sh
```

### 2. Set Up Environment Variables
```bash
cp env.production.example .env.production
# Edit .env.production with your actual values
```

### 3. Deploy the Platform
```bash
./deploy.sh
```

### 4. Access Your Application
- **Frontend**: https://connexly.digitalfootprint.cloud
- **WhatsApp Webhook**: https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id}

## 🌐 Production Deployment

### Option 1: VPS/Cloud Server

#### 1. Server Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB+ 
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+

#### 2. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

#### 3. Clone and Deploy
```bash
# Clone your repository
git clone <your-repo-url>
cd connexly-whatsapp-platform

# Generate SSL certificates
./generate-ssl.sh

# Set up environment variables
cp env.production.example .env.production
nano .env.production

# Deploy
./deploy.sh
```

### Option 2: Cloud Platforms

#### AWS EC2
1. Launch EC2 instance (t3.medium or larger)
2. Configure security groups (ports 80, 443, 22)
3. Follow VPS deployment steps above

#### DigitalOcean Droplet
1. Create droplet with Docker image
2. Follow VPS deployment steps above

#### Google Cloud Platform
1. Create Compute Engine instance
2. Follow VPS deployment steps above

## 🔐 SSL Certificate Setup

### For Production (Recommended)
Use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d connexly.digitalfootprint.cloud

# Copy certificates to nginx/ssl/
sudo cp /etc/letsencrypt/live/connexly.digitalfootprint.cloud/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/connexly.digitalfootprint.cloud/privkey.pem nginx/ssl/key.pem

# Set proper permissions
sudo chown $USER:$USER nginx/ssl/*
```

### For Testing (Self-Signed)
```bash
./generate-ssl.sh
```

## 📱 WhatsApp Business API Setup

### 1. Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add WhatsApp Business product

### 2. Configure Webhook
1. Set webhook URL: `https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id}`
2. Verify token: Use the token from your `.env.production`
3. Subscribe to events: `messages`, `message_deliveries`, `message_reads`

### 3. Test Webhook
```bash
# Test webhook verification
curl "https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id}?hub.mode=subscribe&hub.verify_token={your-token}&hub.challenge=test"
```

## 🗄️ Database Setup

### Initial Migration
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec web pnpm db:migrate

# Seed initial data (if needed)
docker-compose -f docker-compose.prod.yml exec web pnpm db:seed
```

### Backup Strategy
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres whatsjet > backup_$DATE.sql
echo "Backup created: backup_$DATE.sql"
EOF

chmod +x backup.sh
```

## 🔍 Monitoring and Logs

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Health Checks
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check web app health
curl -k https://localhost/api/health
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Kill process or change ports in docker-compose.prod.yml
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs db

# Restart database
docker-compose -f docker-compose.prod.yml restart db
```

#### 3. SSL Certificate Issues
```bash
# Regenerate certificates
./generate-ssl.sh

# Check nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

#### 4. WhatsApp Webhook Not Working
```bash
# Check webhook logs
docker-compose -f docker-compose.prod.yml logs web | grep webhook

# Test webhook endpoint
curl -X POST https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id} \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Migrations
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec web pnpm db:migrate
```

## 📊 Performance Optimization

### Nginx Tuning
- Enable gzip compression
- Configure caching headers
- Rate limiting for webhooks

### Database Optimization
- Regular VACUUM and ANALYZE
- Proper indexing
- Connection pooling

### Monitoring
- Set up log rotation
- Monitor resource usage
- Set up alerts for critical issues

## 🛡️ Security Considerations

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Environment Variables
- Never commit `.env.production` to version control
- Use strong, unique passwords
- Rotate secrets regularly

### SSL/TLS
- Use strong cipher suites
- Enable HSTS
- Regular certificate renewal

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify environment variables
3. Check service status: `docker-compose -f docker-compose.prod.yml ps`
4. Ensure all ports are accessible

## 🎯 Next Steps

After successful deployment:
1. Test WhatsApp webhook functionality
2. Set up monitoring and alerting
3. Configure automated backups
4. Set up CI/CD pipeline for updates
5. Monitor performance and optimize

---

**Happy Deploying! 🚀**
