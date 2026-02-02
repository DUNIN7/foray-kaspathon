# FORAY Deployment Guide - Step by Step

**Created:** 2026-02-02T03:45:00Z
**Author:** Marvin Percival
**Email:** marvinp@dunin7.com
**GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

## What You Are Deploying

You have two files to deploy:

| File | What It Is | Where It Goes |
|------|-----------|---------------|
| `foray-api-server.js` | The backend server (handles AI calls) | `~/foray-api/` |
| `business-analyzer-FINAL.html` | The front-end web page (what visitors see) | `~/foray-kaspathon-website/` |

The server file replaces your existing server. The HTML file replaces the existing business analyzer page.

---

## Before You Start

You will need:

- Your Mac Mini turned on and logged in
- The two files downloaded from this Claude conversation to your Mac Mini's **Downloads** folder
- Access to the **Terminal** app on your Mac Mini

**How to download the files:** In this Claude conversation, click the file name above each file. Your browser will download it to your Downloads folder (usually `~/Downloads/`).

---

## Part 1: Open Terminal

1. On your Mac Mini, click the **magnifying glass** icon in the top-right corner of the screen (Spotlight Search)
2. Type **Terminal**
3. Press **Return** (Enter)
4. A window with a black or white background and a blinking cursor will appear. This is Terminal.

> **Tip:** Every command below must be typed (or pasted) into this Terminal window, then press **Return** to run it.

---

## Part 2: Verify Your Downloads

Let's make sure both files are in your Downloads folder.

**Type this and press Return:**

```bash
ls -la ~/Downloads/foray-api-server.js
```

**You should see something like:**

```
-rw-r--r--  1 marvin  staff  30000  Feb  2 03:30 /Users/marvin/Downloads/foray-api-server.js
```

If you see `No such file or directory`, the file hasn't been downloaded yet. Go back to the Claude conversation and download it.

**Now check the second file. Type this and press Return:**

```bash
ls -la ~/Downloads/business-analyzer-FINAL.html
```

**You should see something like:**

```
-rw-r--r--  1 marvin  staff  28000  Feb  2 03:30 /Users/marvin/Downloads/business-analyzer-FINAL.html
```

If you see `No such file or directory`, go back and download it.

---

## Part 3: Check That Your Server Is Currently Running

Before we change anything, let's confirm your existing server is running.

**Type this and press Return:**

```bash
pm2 status
```

**You should see a table that includes a row like:**

```
+-----+-------------+-------------+---------+----------+------+--------+
| id  | name        | mode        | status  | restarts | cpu  | memory |
+-----+-------------+-------------+---------+----------+------+--------+
| 0   | foray-api   | fork        | online  | 0        | 0%   | 50mb   |
------+-------------+-------------+---------+----------+------+--------+
```

The important thing is that `foray-api` appears and the status says `online`.

> **If you see "command not found":** PM2 isn't installed. Type `npm install -g pm2` and press Return, then try `pm2 status` again.

> **If foray-api is not listed:** Your server may be running under a different name, or it isn't set up yet. See the Troubleshooting section at the bottom.

---

## Part 4: Back Up Your Current Server File

This creates a safety copy. If anything goes wrong, you can restore it.

**Type this and press Return:**

```bash
cp ~/foray-api/foray-api-server.js ~/foray-api/foray-api-server.js.backup
```

**No output means it worked.** That's normal for the `cp` command.

**To double-check the backup was created, type this and press Return:**

```bash
ls -la ~/foray-api/foray-api-server.js.backup
```

**You should see a file listing.** If you see `No such file or directory`, the `~/foray-api/` folder may not exist yet, or the server file has a different name. See Troubleshooting.

---

## Part 5: Copy the New Server File

This replaces your old server file with the new one.

**Type this and press Return:**

```bash
cp ~/Downloads/foray-api-server.js ~/foray-api/foray-api-server.js
```

**No output means it worked.**

**Verify the new file is in place. Type this and press Return:**

```bash
head -8 ~/foray-api/foray-api-server.js
```

**You should see the top of the file, including:**

```
 * FORAY Protocol API Server
 * ...
 * Version:       2.0.0
```

If you see `Version: 2.0.0`, the new file is in place.

---

## Part 6: Check Your .env File

The server needs your Anthropic API key to work. Let's make sure it's there.

**Type this and press Return:**

```bash
cat ~/foray-api/.env
```

**You should see something like:**

```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
PORT=3001
```

**What to check:**

- There IS a line that starts with `ANTHROPIC_API_KEY=`
- After the `=` sign, there is your actual API key (starts with `sk-ant-`)
- There are NO spaces before or after the `=` sign
- The PORT is `3001`

> **If you see "No such file or directory":** You need to create the .env file. Type `nano ~/foray-api/.env` and press Return. Then type these two lines (using YOUR actual API key):
>
> ```
> ANTHROPIC_API_KEY=sk-ant-api03-paste-your-key-here
> PORT=3001
> ```
>
> Then press **Control + O** (that's the letter O, not zero), press **Return** to confirm, then press **Control + X** to exit.

---

## Part 7: Restart the Server

This stops the old server and starts the new one.

**Type this and press Return:**

```bash
pm2 restart foray-api
```

**You should see:**

```
[PM2] Applying action restartProcessId on app [foray-api](ids: [ 0 ])
[PM2] [foray-api](0) [CHECK]
```

**Wait 3 seconds**, then verify it's running. **Type this and press Return:**

```bash
pm2 status
```

**Look at the table.** The `foray-api` row should show:

- **status:** `online` (not `errored` or `stopped`)
- **restarts:** `0` (or a low number)

> **If status shows `errored`:** Something is wrong with the new file. Type `pm2 logs foray-api --lines 20` to see error messages. Common fixes are in Troubleshooting below.

---

## Part 8: Test the Server

Let's make sure the new server is responding correctly.

**Type this and press Return:**

```bash
curl http://localhost:3001/health
```

**You should see a JSON response that includes:**

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "apiKeyConfigured": true,
  "features": {
    "transactionGeneration": true,
    "narrativeGeneration": true,
    "attestationsSupport": true,
    "businessAnalyzer": true
  }
}
```

**What to check:**

- `"status": "healthy"` -- the server is running
- `"version": "2.0.0"` -- you're running the new version (not the old one)
- `"apiKeyConfigured": true` -- your API key is loaded
- All four features show `true`

> **If you see "Connection refused":** The server isn't running. Type `pm2 restart foray-api` and try again.
>
> **If `apiKeyConfigured` is `false`:** Your .env file is missing or the API key line is wrong. Go back to Part 6.
>
> **If version shows something other than 2.0.0:** The old file is still being used. Go back to Part 5 and make sure the copy command worked.

---

## Part 9: Test Transaction Generation

Let's generate an actual FORAY transaction to make sure everything works end to end.

**Type (or paste) this entire block and press Return:**

```bash
curl -X POST http://localhost:3001/api/generate-foray \
  -H "Content-Type: application/json" \
  -d -> {"transactionName":"Test Cash Sale","transactionDescription":"Walk-in customer bought coffee for $5.50 cash at register 1."}' \
  2>/dev/null | python3 -m json.tool | head -30
```

**You should see the beginning of a JSON response that includes:**

```json
{
    "forayJSON": {
        "transaction_id": "...",
        "schema_version": "4.1",
        ...
    },
    "narrative": "...",
    "validation": {
        "valid": true,
        ...
    }
}
```

**What to check:**

- You see `"forayJSON"` -- the transaction was generated
- You see `"narrative"` -- the new narrative feature is working
- You see `"validation"` -- the new validation feature is working

> **If you see an error about the API key:** Check your key at https://console.anthropic.com -- it may be expired or have insufficient credits.
>
> **This call costs approximately $0.05-0.10** in Anthropic API usage.

**The server deployment is complete.** Now let's update the website.

---

## Part 10: Copy the Business Analyzer Page

This replaces the old business analyzer on your website with the new version that shows JSON + Narrative.

**Type this and press Return:**

```bash
cp ~/Downloads/business-analyzer-FINAL.html ~/foray-kaspathon-website/business-analyzer-FINAL.html
```

**No output means it worked.**

**Verify it's in place. Type this and press Return:**

```bash
head -20 ~/foray-kaspathon-website/business-analyzer-FINAL.html
```

**You should see the HTML header including:**

```
    Version:       2.0.0
    Created:       2026-01-29T00:00:00Z
    Modified:      2026-02-02T03:30:00Z
```

> **If you see "No such file or directory":** Your website folder may have a different name. Type `ls ~/` and press Return to see all folders in your home directory. Look for a folder name that contains "foray" or "website" or "kaspathon". Then adjust the path in the command above.

---

## Part 11: Verify the Website Is Serving the New Page

Open a browser on your Mac Mini and go to:

```
http://localhost:9000/business-analyzer-FINAL.html
```

**You should see:**

- The page title says **FORAY Protocol Business Analyzer**
- The background is **light** (white/light gray), not dark
- The layout matches the demo page (cards with mint-colored bottom borders)
- There is a text area on the left to describe your business
- There are Quick Example buttons (Defense Contractor, Financial Services, etc.)

> **If the page still looks dark (old version):** Your browser may be caching the old page. Press **Command + Shift + R** (hard refresh) to force reload.
>
> **If you see "This site can't be reached":** Your Python web server may not be running. See Troubleshooting.

---

## Part 12: Test the Full Flow

1. On the Business Analyzer page, click **"Defense Contractor"** in the Quick Examples
2. Click **"Analyze My Business with FORAY"**
3. Wait for the analysis to appear on the right panel (takes 5-15 seconds)
4. After the analysis appears, you should see a new button: **"Generate Sample FORAY Transaction"**
5. Click it
6. Wait for the JSON and Narrative to appear (takes 5-15 seconds)
7. You should see:
   - A dark JSON block at the top with Copy/Download buttons
   - A green "VALID" badge
   - A "Transaction Narrative" section below with readable prose

**If all of that works, deployment is complete.**

---

## Part 13: Copy to GitHub Repository (Optional)

If you want to update your GitHub repository with the new files:

**Type each of these commands one at a time, pressing Return after each:**

```bash
cp ~/foray-api/foray-api-server.js ~/foray-kaspathon/foray-api-server.js
```

```bash
cp ~/foray-kaspathon-website/business-analyzer-FINAL.html ~/foray-kaspathon/business-analyzer-FINAL.html
```

```bash
cd ~/foray-kaspathon
```

```bash
git add foray-api-server.js business-analyzer-FINAL.html
```

```bash
git commit -m "Update API server to v2.0.0, business analyzer to v2.0.0 with narrative output"
```

```bash
git push
```

> **If git push asks for a password:** GitHub no longer accepts passwords. You need a Personal Access Token. Go to github.com -> Settings -> Developer Settings -> Personal Access Tokens -> Generate New Token. Use that token as your password.

---

## Summary of What You Did

| Step | What Happened |
|------|--------------|
| Part 4 | Backed up the old server file (safety net) |
| Part 5 | Replaced server with v2.0.0 |
| Part 6 | Confirmed API key is configured |
| Part 7 | Restarted the server process |
| Part 8 | Verified server responds healthy |
| Part 9 | Generated a test transaction (proves AI calls work) |
| Part 10 | Replaced business analyzer page |
| Part 11 | Verified new page loads in browser |
| Part 12 | Tested the full analysis + generation flow |

---

## Troubleshooting

### "command not found: pm2"

PM2 is not installed. Install it:

```bash
npm install -g pm2
```

Then go back to Part 3.

---

### "No such file or directory" for ~/foray-api/

Your server folder may have a different name. Find it:

```bash
ls ~/ | grep -i foray
```

This will show any folders with "foray" in the name. Use that folder name instead of `foray-api` in all commands above.

---

### "No such file or directory" for ~/foray-kaspathon-website/

Your website folder may have a different name. Find it:

```bash
ls ~/ | grep -i foray
```

Or find where the website files are served from:

```bash
ps aux | grep python
```

Look for a line that shows `python3 -m http.server 9000` -- the path before it is your website folder.

---

### PM2 shows status "errored"

See what went wrong:

```bash
pm2 logs foray-api --lines 30
```

Common errors:

| Error message | What it means | Fix |
|--------------|---------------|-----|
| `SyntaxError: Unexpected token` | The file got corrupted during download | Download `foray-api-server.js` again |
| `Cannot find module -> express'` | Dependencies not installed | Type `cd ~/foray-api && npm install` |
| `EADDRINUSE: address already in use` | Something else is using port 3001 | Type `lsof -i :3001` to see what, then `kill -9 PID` (replace PID with the number shown) |

After fixing, type `pm2 restart foray-api` to try again.

---

### Health check shows old version (not 2.0.0)

The old file is still being used. Verify the copy worked:

```bash
head -8 ~/foray-api/foray-api-server.js
```

If it still shows the old version, the copy command in Part 5 didn't work. Try again, and make sure you press Return after the command.

If it shows 2.0.0 but the health check still shows old, PM2 may be cached:

```bash
pm2 delete foray-api
pm2 start ~/foray-api/foray-api-server.js --name foray-api
pm2 save
```

---

### Business analyzer page shows dark background (old version)

Your browser is caching the old page. Force refresh:

- **Mac:** Press **Command + Shift + R**
- Or open a **private/incognito** window and navigate to the page

---

### "Analysis failed" or "Transaction generation failed" on the web page

Open Terminal and check if the server is running:

```bash
pm2 status
```

If it says `online`, check the logs for errors:

```bash
pm2 logs foray-api --lines 10
```

If it says `errored` or `stopped`:

```bash
pm2 restart foray-api
```

---

### Python web server not running (website won't load)

Check if it's running:

```bash
ps aux | grep "http.server"
```

If nothing shows, start it:

```bash
cd ~/foray-kaspathon-website
nohup python3 -m http.server 9000 &
```

Then try loading the page again in your browser.

---

### How to undo everything (rollback)

If something went wrong and you want to go back to the old version:

**Restore the server:**

```bash
cp ~/foray-api/foray-api-server.js.backup ~/foray-api/foray-api-server.js
pm2 restart foray-api
```

**The old business analyzer page:** If you didn't back it up, the old version is still in your GitHub repository. You can re-download it from there.

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)
