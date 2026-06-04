#!/bin/bash
# ============================================================
# Engineering Industries — New LXC Setup Script
# Run on FullerD Proxmox HOST (not inside a CT)
# Usage: bash setup-ei-ct.sh
# ============================================================

set -e

# ── CONFIG — adjust if needed ───────────────────────────────
CTID=106
HOSTNAME="EngineeringIndustries"
IP="192.168.1.163/22"
GW="192.168.1.254"
BRIDGE="vmbr0"
MEMORY=1024
STORAGE="local"
DISK_SIZE="8G"
TEMPLATE="local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst"
WEBHOOK_PORT=9003
WEBHOOK_SECRET="ei-$(openssl rand -hex 16)"
REPO_URL="https://github.com/etwan007/engineering-industries.git"
WEBROOT="/var/www/engineering-industries"
DOMAIN="engineerinno.com"
# ────────────────────────────────────────────────────────────

echo "======================================================"
echo " Engineering Industries LXC Setup"
echo " CTID: $CTID  |  IP: $IP  |  Domain: $DOMAIN"
echo "======================================================"

# ── 1. Create CT ────────────────────────────────────────────
echo ""
echo "[1/7] Creating LXC container $CTID..."
pct create $CTID $TEMPLATE \
  --hostname $HOSTNAME \
  --memory $MEMORY \
  --swap 512 \
  --rootfs $STORAGE:$DISK_SIZE \
  --net0 name=eth0,bridge=$BRIDGE,gw=$GW,ip=$IP,type=veth \
  --onboot 1 \
  --startup order=3,up=30 \
  --unprivileged 1 \
  --features nesting=1
echo "[1/7] ✓ Container created"

# ── 2. Start CT ─────────────────────────────────────────────
echo "[2/7] Starting container..."
pct start $CTID
sleep 6
echo "[2/7] ✓ Container started"

# ── 3. Install packages ─────────────────────────────────────
echo "[3/7] Installing packages..."
pct exec $CTID -- bash -c "
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq nginx git curl rsync
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt-get install -y -qq nodejs
  node -v && npm -v
"
echo "[3/7] ✓ Packages installed"

# ── 4. Clone repo and build ─────────────────────────────────
echo "[4/7] Cloning repo and building..."
pct exec $CTID -- bash -c "
  mkdir -p $WEBROOT
  git clone $REPO_URL $WEBROOT
  cd $WEBROOT
  npm install --legacy-peer-deps
  npm run build
  chown -R www-data:www-data $WEBROOT/dist
"
echo "[4/7] ✓ Repo cloned and built"

# ── 5. Nginx config ─────────────────────────────────────────
echo "[5/7] Writing Nginx config..."
pct exec $CTID -- bash -c "cat > /etc/nginx/sites-available/engineering-industries << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;

    root $WEBROOT/dist;
    index index.html index.htm;

    server_name $DOMAIN www.$DOMAIN;

    # Redirect www to non-www
    if (\$host = www.$DOMAIN) {
        return 301 https://$DOMAIN\$request_uri;
    }

    # Cloudflare real IP passthrough
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2c0f:f248::/32;
    set_real_ip_from 2a06:98c0::/29;
    real_ip_header CF-Connecting-IP;

    # React SPA — all routes fall back to index.html
    location / {
        try_files \$uri \$uri/ /index.html;

        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy strict-origin-when-cross-origin;

        # Don't cache index.html so deploys take effect immediately
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Cache hashed static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Webhook — proxy to Node server
    location /webhook {
        proxy_pass http://127.0.0.1:$WEBHOOK_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 30s;
    }

    location /health {
        proxy_pass http://127.0.0.1:$WEBHOOK_PORT;
    }

    location /deploy {
        proxy_pass http://127.0.0.1:$WEBHOOK_PORT;
    }

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/engineering-industries /etc/nginx/sites-enabled/engineering-industries
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx"
echo "[5/7] ✓ Nginx configured"

# ── 6. Deploy script ────────────────────────────────────────
echo "[6/7] Writing deploy script, webhook server, and systemd service..."

pct exec $CTID -- bash -c "cat > /root/deploy.sh << 'DEPLOYEOF'
#!/bin/bash
REPO_DIR=$WEBROOT
LOG_FILE=/var/log/deploy-ei.log
DATE_TIME=\$(date +%Y-%m-%dT%H:%M:%S)
touch \$LOG_FILE && chmod 644 \$LOG_FILE
log() { echo \"[\$DATE_TIME] \$1\" | tee -a \$LOG_FILE; }

log \"===== DEPLOYMENT STARTED =====\"
cd \$REPO_DIR || { log \"ERROR: Cannot cd to \$REPO_DIR\"; exit 1; }

BEFORE=\$(git rev-parse HEAD 2>/dev/null || echo none)
log \"Current commit: \$BEFORE\"

# Pull — hard reset on failure (same pattern as CT 102)
git_out=\$(git pull 2>&1)
if [ \$? -ne 0 ]; then
  log \"WARNING: git pull failed, hard resetting...\"
  git stash
  git reset --hard HEAD
  git clean -fd
  git fetch origin main
  git reset --hard origin/main
  git_out=\$(git pull 2>&1)
  [ \$? -ne 0 ] && { log \"ERROR: git pull still failed\"; exit 1; }
fi
log \"Git: \$git_out\"

AFTER=\$(git rev-parse HEAD 2>/dev/null || echo none)
log \"New commit: \$AFTER\"

# Build only if commit changed or dist is missing
if [ \"\$BEFORE\" != \"\$AFTER\" ] || [ ! -f \"\$REPO_DIR/dist/index.html\" ]; then
  log \"Building React app...\"

  TMPDIR=\"/tmp/ei-build-\$(date +%s)\"
  mkdir -p \$TMPDIR
  rsync -a --exclude=node_modules --exclude=dist \$REPO_DIR/ \$TMPDIR/

  cd \$TMPDIR
  npm install --legacy-peer-deps 2>&1 | tee -a \$LOG_FILE
  npm run build 2>&1 | tee -a \$LOG_FILE

  if [ ! -d \"\$TMPDIR/dist\" ]; then
    log \"ERROR: Build failed — no dist directory produced\"
    rm -rf \$TMPDIR; exit 1
  fi

  cd \$REPO_DIR

  # Remove old dist safely
  chown -R www-data:www-data \$REPO_DIR/dist 2>/dev/null || true
  chmod -R 755 \$REPO_DIR/dist 2>/dev/null || true
  rm -rf \$REPO_DIR/dist || mv \$REPO_DIR/dist \$REPO_DIR/dist-backup-\$(date +%s)

  cp -r \$TMPDIR/dist \$REPO_DIR/
  rm -rf \$TMPDIR

  chown -R www-data:www-data \$REPO_DIR/dist
  log \"Build complete — dist updated\"
else
  log \"No changes detected — skipping build\"
fi

systemctl reload nginx && log \"Nginx reloaded\"
log \"===== DEPLOYMENT FINISHED =====\"
exit 0
DEPLOYEOF
chmod +x /root/deploy.sh"

# ── Webhook server ──────────────────────────────────────────
pct exec $CTID -- bash -c "cat > /root/webhook-server.js << 'WEBHOOKEOF'
const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');

const PORT = $WEBHOOK_PORT;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const DEPLOY_SCRIPT = '/root/deploy.sh';
const LOG_FILE = '/var/log/webhook-ei.log';

function log(msg) {
  const line = \`[\${new Date().toISOString()}] \${msg}\n\`;
  process.stdout.write(line);
  fs.appendFileSync(LOG_FILE, line);
}
try { fs.accessSync(LOG_FILE); } catch(e) { fs.writeFileSync(LOG_FILE, ''); fs.chmodSync(LOG_FILE, 0o644); }

function verifySignature(payload, sig) {
  if (!WEBHOOK_SECRET) { log('WARNING: No secret set'); return true; }
  if (!sig) { log('ERROR: No signature in request'); return false; }
  try {
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
  } catch(e) { log('ERROR: Sig verify failed: ' + e.message); return false; }
}

function runDeploy(payload) {
  log('Running deploy script...');
  let commitInfo = '';
  try {
    const d = JSON.parse(payload);
    if (d.head_commit) commitInfo = d.repository?.full_name + ' @ ' + d.head_commit.id?.substring(0,7) + ' — ' + d.head_commit.message;
  } catch(e) {}
  if (commitInfo) log('Triggered by: ' + commitInfo);

  exec(DEPLOY_SCRIPT, (err, stdout, stderr) => {
    if (err) {
      log('Deploy error: ' + err.message);
      if (stderr && (stderr.includes('untracked') || stderr.includes('Aborting'))) {
        log('Git conflict detected — running hard reset via deploy script...');
        exec(DEPLOY_SCRIPT, (e2, o2) => { if (!e2) log('Re-deploy succeeded'); });
      }
      return;
    }
    if (stdout) log('Deploy output: ' + stdout.trim());
    if (stderr) log('Deploy stderr: ' + stderr.trim());
    log('Deploy complete');
  });
}

http.createServer((req, res) => {
  log(\`\${req.method} \${req.url} from \${req.socket.remoteAddress}\`);

  if (req.url === '/health') {
    res.writeHead(200); res.end('OK'); return;
  }

  if (req.url === '/deploy' && req.method === 'POST') {
    res.writeHead(200); res.end('Deployment started');
    runDeploy('{"manual":true}'); return;
  }

  if (req.url === '/webhook' && req.method === 'POST') {
    let payload = '';
    req.on('data', c => payload += c);
    req.on('end', () => {
      if (req.headers['x-github-event'] === 'ping') {
        log('Ping received');
        res.writeHead(200); res.end('pong'); return;
      }
      if (!verifySignature(payload, req.headers['x-hub-signature-256'])) {
        log('Invalid signature');
        res.writeHead(403); res.end('Forbidden'); return;
      }
      log('Signature OK — deploying');
      res.writeHead(200); res.end('Deploying');
      runDeploy(payload);
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
}).listen(PORT, () => log(\`Webhook server started on port \${PORT}\`));

process.on('uncaughtException', e => log('Uncaught: ' + e.message));
process.on('unhandledRejection', r => log('Unhandled rejection: ' + r));
log('Webhook server initialized');
WEBHOOKEOF"

# ── Systemd service ─────────────────────────────────────────
pct exec $CTID -- bash -c "cat > /etc/systemd/system/ei-webhook.service << SVCEOF
[Unit]
Description=Engineering Industries GitHub Webhook Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
ExecStart=/usr/bin/node /root/webhook-server.js
Restart=always
RestartSec=10
Environment=WEBHOOK_SECRET=$WEBHOOK_SECRET

[Install]
WantedBy=multi-user.target
SVCEOF
systemctl daemon-reload
systemctl enable ei-webhook
systemctl start ei-webhook
sleep 2
systemctl status ei-webhook --no-pager"

echo "[6/7] ✓ Deploy script, webhook server, and systemd service configured"

# ── 7. Verify ───────────────────────────────────────────────
echo "[7/7] Verifying..."
pct exec $CTID -- bash -c "
  echo '--- Nginx status ---'
  systemctl is-active nginx
  echo '--- Webhook service status ---'
  systemctl is-active ei-webhook
  echo '--- Health check ---'
  curl -s http://localhost/health || echo 'health endpoint not yet reachable via nginx (normal if no CF tunnel yet)'
  echo '--- Dist contents ---'
  ls $WEBROOT/dist/
"
echo "[7/7] ✓ Verification complete"

# ── Summary ─────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║           ✓  Setup Complete!                         ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Container:     CTID $CTID  @  $IP"
echo "║  Webroot:       $WEBROOT/dist"
echo "║  Domain:        $DOMAIN"
echo "║  Webhook port:  $WEBHOOK_PORT"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  WEBHOOK SECRET (copy this now!):"
echo "║  $WEBHOOK_SECRET"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  NEXT STEPS:"
echo "║"
echo "║  1. CLOUDFLARE TUNNEL"
echo "║     Dashboard → Zero Trust → Networks → Tunnels"
echo "║     Add public hostname:"
echo "║       Domain:   $DOMAIN"
echo "║       Service:  http://192.168.1.163:80"
echo "║"
echo "║  2. GITHUB WEBHOOK"
echo "║     github.com/etwan007/engineering-industries"
echo "║     → Settings → Webhooks → Add webhook"
echo "║       Payload URL:   https://$DOMAIN/webhook"
echo "║       Content type:  application/json"
echo "║       Secret:        (secret printed above)"
echo "║       Events:        Just the push event"
echo "║"
echo "║  3. TEST"
echo "║     curl http://192.168.1.163/health"
echo "║     curl -X POST http://192.168.1.163/deploy"
echo "║     Then push a commit and watch it auto-deploy"
echo "║"
echo "║  4. LOGS"
echo "║     pct exec $CTID -- tail -f /var/log/deploy-ei.log"
echo "║     pct exec $CTID -- tail -f /var/log/webhook-ei.log"
echo "╚══════════════════════════════════════════════════════╝"
