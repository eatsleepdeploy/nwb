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
  - Setup new pages project
  - Add an `afterChange` trigger to all the places to run a deploy post build
    - Use a Task, and switch the existing build to this approach.
  - Confirm the deploy looks ok
- [] Reset rpi db
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