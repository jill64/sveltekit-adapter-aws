# lambda-s3

This architecture uploads static assets to S3 and handles server requests with Lambda.

![architecture](./arch.png)

## Pros

- Reducing Lambda load for static assets request

## Cons

- Limited Pre-rendering

Files outside of the \_app directory will continue to be served by lambda.When using a large SSG, you may reach the Lambda package size limit. (50MB:zipped, 250MB:unzipped)

## Use cases

- Standard web app
