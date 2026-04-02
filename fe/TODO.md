# General
- [] Setup general CSS for:
  - Font
  - Boxes & borders
  - Links colours, including mouseover
  - Header scaling
  - Colours
- [] Work out how to import from WordPress
  - Need to update things to paginate probably 
- [] Check SEO stuff
  - Add og: stuff
  - Add metadata title/description

# Comments
- [] Setup a worker to receive comment posts
  - Store in D1
  - Check with akismet
  - Ensure whatever cloudflare bot-protections work.
- [] Setup sending comment from script from frontend
- [] Add a job to pull from cloudflare
  - Run every few hours
  - Store in local DB - dedupe based on post and store the D1 id in the local DB so no dupes
  - Update D1 to say already gotten to filter out of next sync
  - Trigger an email notification to KT if new comments

# Deployment
- [] Setup Cloudflare deployment
  - Setup new pages project
  - Add an `afterChange` trigger to all the places to run a deploy post build
  - Confirm the deploy looks ok
- [] Setup editing environment for KT
  - enable live editing

# Post-1st-deploy
- [] Add a listing page for all tags (why not, SEO)
- [] Search: figure out how to do this
  - Workers?
    - With main DB in D1?
    - With a copy db in D1?
    - Some sort of JSON dump with regex query?
  - Algolia?
- [] Write up blog post about approach
- [] work out save draft/publish published at bug
- [] Switch to use `npm run preview` for pi env with auto-build triggers on save
  - work out how to get it to include drafts on preview 
- [] Ad debounce to build/deploy afterChange in case of build updates