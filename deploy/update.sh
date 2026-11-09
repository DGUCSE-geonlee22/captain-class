#!/usr/bin/env bash
# 학교 서버(cs.dongguk.edu:102)용 실행·업데이트 스크립트
# 사용: ssh -p 102 <학번>@cs.dongguk.edu 'cd ~/captain-class && ./deploy/update.sh'
# - GitHub main을 받아 빌드하고 tmux 세션 "cc"의 app 창을 다시 켠다.
# - tunnel 창이 없을 때만 새로 띄운다 (있으면 그대로 두므로 공개 주소가 유지된다).
# - 데이터(server/data/cc.sqlite)는 그대로 남는다.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/opt/node/bin:$PATH"
PORT="${CC_PORT:-18787}"
CLOUDFLARED="${CLOUDFLARED:-$HOME/bin/cloudflared}"
LOG_DIR="$PWD/server/data"; mkdir -p "$LOG_DIR"

git pull --ff-only -q
npm ci --no-audit --no-fund --loglevel=error
npm run build >/dev/null
echo "code: $(git log --oneline -1)"

tmux has-session -t cc 2>/dev/null || tmux new-session -d -s cc -n app
tmux list-windows -t cc -F '#W' | grep -qx app || tmux new-window -t cc -n app
tmux send-keys -t cc:app C-c
sleep 1
tmux send-keys -t cc:app "cd '$PWD' && export PATH='$HOME/.local/opt/node/bin':\$PATH && HOST=127.0.0.1 PORT=$PORT node server/index.mjs 2>&1 | tee '$LOG_DIR/app.log'" Enter

for i in $(seq 1 20); do curl -fs "http://127.0.0.1:$PORT/api/health" >/dev/null && break; sleep 1; done
curl -fs "http://127.0.0.1:$PORT/api/health" >/dev/null && echo "app up (port $PORT)" || { echo "app failed"; tail -20 "$LOG_DIR/app.log"; exit 1; }

if ! tmux list-windows -t cc -F '#W' | grep -qx tunnel; then
  tmux new-window -t cc -n tunnel
  tmux send-keys -t cc:tunnel "'$CLOUDFLARED' tunnel --no-autoupdate --url http://127.0.0.1:$PORT 2>&1 | tee '$LOG_DIR/tunnel.log'" Enter
fi
for i in $(seq 1 40); do URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_DIR/tunnel.log" 2>/dev/null | tail -1 || true); [ -n "${URL:-}" ] && break; sleep 1; done
echo "public address: ${URL:-(아직 없음 · tmux attach -t cc 로 tunnel 창 확인)}"
