# AWS Algorand Reach POC

HTTP API bridge from Web2 to Web3 using AWS (API Gateway/Lambda), Algorand (via Reach.sh) and Serverless.com

## Windows Setup

Follow setup instructions here: https://docs.reach.sh/guide-windows.html

Clone this repo to a WSL directory. E.g. `\\wsl$\Ubuntu\home\hutch120\github\aws-algorand-reach-poc`

You will certainly need to install some additional 3rd party libraries
e.g. nodejs, yarn, gcc, g++ and more... follow the error trail for the required libraries.

## Program Setup

Create an Algorand account using the [Algorand Wallet App](https://www.algorandwallet.com/)
Fund account: https://testnet.algoexplorer.io/dispenser (Tip: Copy the Algo account addresses from the console output of this program)
Copy secrets_template.js to secrets.js and add the account details.

## VSCode

Check project is running in WSL:Ubuntu (Green area at bottom left in VSCode)
If not, run in WSL:Ubuntu (click green area and select reopen folder in WSL)

## Install dependancies

`yarn`

## Testing

Run `yarn test` will run Jest tests.

## Deploy with Serverless.com

See `deploy.yml`

- Log into Serverless.com
- Create a serverless.com app and copy the name from ./serverless.yml for the org/app/service values
- Create a serverless.com access key and save it to Github actions as `SERVERLESS_ACCESS_KEY`

## Github setup

**Add secrets**

```
ALICE_ADDRESS
ALICE_ACCOUNT_PHRASE
SERVERLESS_ACCESS_KEY
```
