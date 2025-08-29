# 🚀 WhatsApp Connexly Platform - Deployment Checklist

## 🌐 **Your Domain: connexly.digitalfootprint.cloud**

### **📋 Pre-Deployment Checklist**

- [ ] **DNS Configuration**
  - [ ] Point `connexly.digitalfootprint.cloud` to your server IP
  - [ ] Wait for DNS propagation (can take up to 24 hours)

- [ ] **Server Requirements**
  - [ ] Server with Docker support
  - [ ] Ports 80, 443, and 22 open
  - [ ] At least 4GB RAM, 2+ CPU cores

- [ ] **WhatsApp Business API**
  - [ ] Meta Developer account created
  - [ ] WhatsApp Business app configured
  - [ ] WABA account verified
  - [ ] Access tokens ready

### **🔧 Deployment Steps**

#### **Step 1: Server Setup**
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
# Log out and back in, or run: newgrp docker
```

#### **Step 2: Clone and Configure**
```bash
# Clone your repository
git clone <your-repo-url>
cd whatsapp-connexly-platform

# Copy environment template
cp env.production.example .env.production

# Edit with your credentials
nano .env.production
```

#### **Step 3: Environment Variables**
```bash
# Required variables to set:
POSTGRES_PASSWORD=your_secure_password_here
NEXTAUTH_SECRET=your_generated_secret_here
FACEBOOK_APP_ID=your_meta_app_id
FACEBOOK_APP_SECRET=your_meta_app_secret
WHATSAPP_CONFIG_ID=your_whatsapp_config_id

# These are already set for your domain:
NEXTAUTH_URL=https://connexly.digitalfootprint.cloud
CORS_ORIGIN=https://connexly.digitalfootprint.cloud
```

#### **Step 4: SSL Certificates**
```bash
# Option A: Let's Encrypt (Recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d connexly.digitalfootprint.cloud

# Copy certificates
sudo cp /etc/letsencrypt/live/connexly.digitalfootprint.cloud/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/connexly.digitalfootprint.cloud/privkey.pem nginx/ssl/key.pem
sudo chown $USER:$USER nginx/ssl/*

# Option B: Self-signed (Testing only)
./generate-ssl.sh
```

#### **Step 5: Deploy**
```bash
# Deploy the platform
./deploy.sh
```

### **✅ Post-Deployment Verification**

#### **Check Services**
```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### **Test Endpoints**
```bash
# Health check
curl -k https://connexly.digitalfootprint.cloud/api/health

# Test webhook (replace {vendor-id} and {token})
curl "https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id}?hub.mode=subscribe&hub.verify_token={token}&hub.challenge=test"
```

#### **WhatsApp Webhook Configuration**
1. **Meta Developer Console**
   - Webhook URL: `https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id}`
   - Verify Token: Use the token from your `.env.production`
   - Subscribe to: `messages`, `message_deliveries`, `message_reads`

2. **Test Webhook**
   ```bash
   curl -X POST https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id} \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

### **🔍 Troubleshooting**

#### **Common Issues**
- **Port 80/443 blocked**: Check firewall settings
- **SSL errors**: Verify certificate paths and permissions
- **Database connection**: Check PostgreSQL container logs
- **Webhook not working**: Verify Meta webhook configuration

#### **Useful Commands**
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart web

# Check SSL certificate
openssl s_client -connect connexly.digitalfootprint.cloud:443 -servername connexly.digitalfootprint.cloud

# Test webhook locally
curl -X POST http://localhost:3000/api/webhooks/whatsapp/{vendor-id} \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **📱 WhatsApp Testing**

#### **Send Test Message**
1. Go to `https://connexly.digitalfootprint.cloud/chat`
2. Select a contact
3. Send a test message
4. Check logs for WhatsApp API calls

#### **Monitor Webhooks**
```bash
# Watch webhook logs
docker-compose -f docker-compose.prod.yml logs -f web | grep webhook

# Check database for messages
docker-compose -f docker-compose.prod.yml exec web pnpm db:studio
```

### **🔄 Maintenance**

#### **Update Platform**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

#### **SSL Certificate Renewal**
```bash
# Let's Encrypt auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet

# Manual renewal
sudo certbot renew
sudo cp /etc/letsencrypt/live/connexly.digitalfootprint.cloud/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/connexly.digitalfootprint.cloud/privkey.pem nginx/ssl/key.pem
sudo chown $USER:$USER nginx/ssl/*
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 🎯 **Your Platform URLs**

- **Frontend**: https://connexly.digitalfootprint.cloud
- **API Health**: https://connexly.digitalfootprint.cloud/api/health
- **WhatsApp Webhook**: https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/{vendor-id}
- **Chat Interface**: https://connexly.digitalfootprint.cloud/chat

---

**🚀 Ready to deploy to connexly.digitalfootprint.cloud!**
