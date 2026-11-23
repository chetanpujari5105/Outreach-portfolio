#!/bin/bash
# wait.sh <chat-fragment> <expected image count>: polls the Brave tab until that many finished images exist and streaming stopped.
frag="$1"; want="$2"
for i in $(seq 1 120); do
  r=$(osascript - "$frag" <<'AS'
on run argv
  tell application "Brave Browser"
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains (item 1 of argv) then return (execute t javascript "[...document.querySelectorAll('main img')].filter(i=>i.complete&&i.naturalWidth>500).length+'|'+!!document.querySelector('[aria-label=\"Stop streaming\"],[data-testid=stop-button]')")
      end repeat
    end repeat
  end tell
end run
AS
)
  n=${r%%|*}; busy=${r##*|}
  if [ "$n" -ge "$want" ] && [ "$busy" = "false" ]; then echo "ready $n"; exit 0; fi
  sleep 5
done
echo "timeout $r"; exit 1
