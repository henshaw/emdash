---
"emdash": patch
---

Fixes Astro route-cache refreshes using outdated site settings and taxonomy definitions after a purge, including on sites without an object cache. Collection list cache hints no longer supply `Last-Modified`, so deleting or unpublishing entries cannot leave edge-cached lists stale indefinitely through conditional `304` responses.
