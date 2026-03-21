# General
- [] Setup general CSS for:
  - Font
  - Boxes & borders
  - Links colours, including mouseover
  - Header scaling
  - Colours
- [] Work out how to import from WordPress
  - Need to update things to paginate probably 
- [] Add favicon
- [] Check SEO stuff
  - Add canonical
  - Add og: stuff
  - Add metadata title/description

# Comments
- [] Figure out a worker setup to store them
- [] Figure out a cron sync to pull them through to payload
- [] Add "Hot right now" section to homepage
  - Ordered by number of comments - needs comme
- [] Add "most popular" to interviews page
- [] Add in email notifications

# Deployment
- [] Setup Cloudflare deployment
- [] Setup editing environment for KT
- [] Database backups - point at D1?

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