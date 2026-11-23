# Brand-site photos and QA

Photos come from ChatGPT in Brave (the browser the Claude extension drives).
Brave needs View → Developer → Allow JavaScript from Apple Events.

1. Open a new ChatGPT chat for the brand; note part of its URL id, e.g. `6b0478f0`.
2. `./send.sh 6b0478f0 "single standalone photograph, not a collage, no text… "`
3. `./wait.sh 6b0478f0 <number of images expected in the chat>`
4. `./grab.sh 6b0478f0 ../../public/assets/<brand>-<name>.webp [index]`. It writes WebP straight to disk, max 1600px.

If ChatGPT shows "Which image do you like more?", click Skip.

QA: run the preview server, then `OUT=/tmp/ node shots.mjs v1 /site/<slug> /site/<slug>/<page>`.
This writes full-page JPEGs at 1440 and 390 with reduced motion. Sticky and fixed elements look wrong in full-page captures, so check those in a real viewport.
