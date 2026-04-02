# General
- [] Setup general CSS for:
  - Font
  - Boxes & borders
  - Links colours, including mouseover
  - Header scaling
  - Colours
- [] Work out how to import from WordPress
- [] Check SEO stuff
  - Add og: stuff
  - Add metadata title/description

# Comments
- [] Add in reply behaviour
- [] Add timestamps to the D1 comments
- [] Add a job to pull from cloudflare
  - Run every few hours
  - Skip if not running in docker to prevent pulling from local machine
  - Store in local DB - dedupe based on post and store the D1 id in the local DB so no dupes
  - When getting, get where id is bigger than the last local comment we have

# Deployment
- [] Setup Cloudflare deployment
  - Setup new pages project
  - Add an `afterChange` trigger to all the places to run a deploy post build
  - Confirm the deploy looks ok
- [] Copy over all posts.
- [] Copy over all comments.
- [] Switch domain over & test comments

# Post-1st-deploy
- [] Add email triggering if new comments found.
- [] Search: figure out how to do this
  - Workers?
    - With main DB in D1?
    - With a copy db in D1?
    - Some sort of JSON dump with regex query?
  - Algolia?
- [] Ad debounce to build/deploy afterChange in case of build updates
- [] Check cloudflare bot protection
  - site
  - comments
- [] Write up blog post about approach