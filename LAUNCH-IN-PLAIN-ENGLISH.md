# What's left before the site goes live

Written 14 August 2026, in plain words. Nine things, in the order they have to
happen. Each one says what it is, and what breaks if it gets skipped.

The technical version of all this is in `LAUNCH-CHECKLIST-14AUG2026.md`. This
file says the same thing without the jargon.

---

## Already done today — nothing needed from you

- **The owner's edits were invisible to everyone except him.** Found and fixed
  at 5 pm. He changed a line, it saved properly, his own screen showed it — and
  every other visitor still saw the old words. Nothing was broken in the
  database; the new words were simply never put on the page for anybody else.
  If this had gone live as it was, the site would have looked finished and read
  wrong, with nothing anywhere to tell you. **Fixed, tested against the real
  database, and sent up.**
- **A spam trap now sits on the enquiry form**, so robots can't fill your
  database with junk.
- **The server setup guide was wrong in three ways** that would each have
  broken launch day. All three fixed.
- **The owner's 347 text edits from the live site are loaded onto this
  machine** and confirmed working.
- **Everything above is now sent up** — step 1 is done.

---

## Do these, in this order

### 1. Send the work up — ✅ **done, 5 pm**

Everything fixed today sat only on this laptop. `git push` has been run; the
branch `feat/edit-auth` on the server side now has all of it, including the
edits-are-invisible fix.

> **If skipped:** the server can't see any of it, and nothing else on this list
> would work.

---

### 2. Put the three edit passwords on the server — *before* deploying

The Edit-text feature needs three secret values stored in a file on the server
called `.env`. They are deliberately not in the code, so nothing carries them
up automatically. You have to type them in yourself.

> **If skipped:** it is not just the Edit button that breaks — **every page** of
> nestingtree.in shows an error message instead of the site.

---

### 3. Deploy the right version, by name

```
./deploy.sh feat/edit-auth
```

That last part is the version with the password on the Edit button. It is
**not** the version the server picks by default.

> **If skipped:** an older version goes live where the Edit button has **no
> password at all** — any visitor could change your prices, RERA numbers and
> phone number.

---

### 4. Check what actually went live

```
git log -1
```

Read the message it prints. Don't trust the version *name* the server shows —
on this particular server that name is stale and will happily lie to you.

> **If skipped:** you believe the new site is live when the old one is.
> Everything looks fine until someone edits your prices.

---

### 5. Fix the deploy shortcut's default

Inside `deploy.sh` on the server, line 4 sets a fallback version. If anyone ever
types `./deploy.sh` on its own, that fallback is what goes live.

> **If skipped:** one careless command, any day from now on, quietly rolls the
> whole site back to an unprotected version.

---

### 6. Turn on the doorman

Install the ready-made file `deploy/nginx-nestingtree.conf`. It caps how many
times a minute one visitor can hit the enquiry form or try the edit password.

> **If skipped:** your edit password is a single shared word with unlimited
> guesses. A robot can try thousands a minute until it gets in.

---

### 7. Back up the database — tonight, not next week

Think of the website code as a printed book, and the database as the sticky
notes stuck on top of it. The owner's 347 wording changes and every enquiry are
sticky notes. They exist nowhere else.

> **If skipped:** if that server is lost, the site rebuilds from the code
> perfectly — and every word the owner has changed since 6 August is silently
> back to the old wording. No error, no warning.

---

### 8. Point the domain at the server

nestingtree.in still shows the parking page. Point both `nestingtree.in` and
`www.nestingtree.in` at the server. This takes time to spread across the
internet, so do it early, not last.

> **If skipped:** everything else is finished and nobody can see it. And if
> anyone shares the link before this works, WhatsApp remembers the broken
> preview for days.

---

### 9. Test four things on the real site

1. Send yourself an enquiry through the form and confirm it lands in the table.
2. Open a made-up edit link and confirm you get an ordinary "page not found".
3. Click an old photo link and confirm it still opens.
4. Open the home page on your phone, on mobile data.
5. **New, and do not skip it:** open the live site in a browser that has never
   signed in to the editor — a phone on mobile data, or a private window — and
   check that the owner's changed wording is on screen. That is the fix from
   this afternoon, and a browser that *has* edited before will show you the
   right words either way, so it has to be a clean one.

> **If skipped:** the most likely silent failure is the enquiry form — it can
> look like it worked while saving nothing at all.

---

## Only the owner can answer these

None of these stop the site going live. The first one goes live **wrong** if he
doesn't reply.

- **Two addresses are wrong on screen right now.** Shikhar and Prithvi. He said
  so on 11 August and never sent the correct ones. I checked the imported
  edits — he hasn't quietly fixed them through the Edit button either.
- **Four photographs may not be his buildings.** They're on the gallery and
  three project pages. This is a permission question before it's anything else.
- **The Grievance Officer's name is still blank.** A placeholder sits on the
  privacy page. Indian privacy practice expects a real named person.
- **Nobody is told when an enquiry arrives.** The form saves to the database and
  does nothing else — no email, no SMS, no WhatsApp. Even "Vipin checks it every
  morning" is an answer. Write down whose job it is.
- **A lawyer should read the privacy and terms pages.** They were written to be
  accurate, but nobody qualified has checked them.

---

## Can wait until after launch

- Images don't declare their size, so pages jump slightly while loading
- Shaurya prints its plot number twice on the same card
- Ishaan has the thinnest gallery and no interior finishes list

---

Nothing left on this list can be done from the code. It's all on the server, on
the live site, or with the owner. Everything from today is committed and sent
up — step 1 is done.
