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

# Deployment
- [] Setup Cloudflare deployment
  - Add an `afterChange` trigger to all the places to run a deploy post build
- [] Ensure all posts are moved over.
- [] Ensure all comments are moved over.
- [] Test comments. 
- [] Switch domain over & test comments

# Post-1st-deploy
- [] Setup a sitemap
- [] Add email triggering if new comments found.
- [] Switch build approaches to a task-based system
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
- [] Add a 404 page