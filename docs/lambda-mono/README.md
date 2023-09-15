# lambda-mono

In this architecture, all artifacts (including static assets) are uploaded to a single Lambda, and all requests are handled by that Lambda.

![architecture](./arch.png)

## Pros

- Fast deploy
- Easy to debug, logging, trace

## Cons

- Poor scaling

Since a single Lambda handles all requests involving static assets, you are likely to hit concurrency limits. Enabling CloudFront alleviates this issue, but is not recommended for production use.

## Example use case

- Test
- Development
