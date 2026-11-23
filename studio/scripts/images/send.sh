#!/bin/bash
# send.sh <chat-fragment> "<prompt>": types the prompt into the ChatGPT composer in Brave and presses Send.
frag="$1"; p=$(printf '%s' "$2" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))')
js="(()=>{const ed=document.querySelector('[contenteditable=true]');ed.focus();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,$p);setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='Send');b&&b.click()},900);return 'typed'})()"
osascript - "$frag" "$js" <<'AS'
on run argv
  tell application "Brave Browser"
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains (item 1 of argv) then return (execute t javascript (item 2 of argv))
      end repeat
    end repeat
  end tell
end run
AS
