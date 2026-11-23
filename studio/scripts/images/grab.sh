#!/bin/bash
# grab.sh <chat-id-fragment> <out.webp> [image index, default -1 = latest] [max width, default 1600]
# Reads a finished ChatGPT image from the Brave tab as WebP straight into a file (never through the chat).
set -e
frag="$1"; out="$2"; idx="${3:--1}"; w="${4:-1600}"
js() { osascript - "$frag" "$1" <<'AS'
on run argv
  tell application "Brave Browser"
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains (item 1 of argv) then return (execute t javascript (item 2 of argv))
      end repeat
    end repeat
  end tell
  return "NOTAB"
end run
AS
}
js "window.__b64='';(async()=>{try{const imgs=[...document.querySelectorAll('main img')].filter(i=>i.naturalWidth>500);const im=imgs.at($idx);const s=Math.min(1,$w/im.naturalWidth);const cv=document.createElement('canvas');cv.width=Math.round(im.naturalWidth*s);cv.height=Math.round(im.naturalHeight*s);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);window.__b64=cv.toDataURL('image/webp',0.82).split(',')[1]}catch(e){window.__b64='ERR'+e}})();'started'" >/dev/null
for i in $(seq 1 30); do n=$(js "String(window.__b64.length)"); [ "$n" != "0" ] && break; sleep 0.5; done
: > "$out.b64"; off=0
while [ $off -lt $n ]; do js "window.__b64.slice($off,$off+200000)" >> "$out.b64"; off=$((off+200000)); done
tr -d '\n' < "$out.b64" | base64 -d > "$out"; rm "$out.b64"
echo "$out $(wc -c < "$out") bytes"
