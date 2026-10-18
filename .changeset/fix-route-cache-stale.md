---
"emdash": patch
---

Fixes route-cache fill rendering so it no longer reuses stale per-isolate site settings and taxonomy-definition caches, and removes `Last-Modified` validators from collection list cache hints so deleted or unpublished entries cannot freeze edge-cached pages indefinitely.
