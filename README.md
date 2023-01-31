# FLITTER APP

## REQUIREMENTS

Make sure to have installed node.js at the version 16.13.1.

## INSTALLATION

Do the following steps:

```sh
git clone https://github.com/Isynopoulos1/flitter.git
cd flitter
npm i
```

Once you installed all the node_modules, create a file called `keys_local.js` within the ´config´ folder of the application with the following content:

```js
const config = {
  mongo_uri: "<URI_OF_DATABASE>",
  jwt_token: "asifgawkfjhwohfbkl2348723gr23kjrvf232jhr239fgbw3kfjbf"
}

exports.config = config
```

Ask me to share you the `URI_OF_DATABASE` of the atlas mongodb database or create a new one.
Once this file is created with the correct `URI_OF_DATABASE` you can launch the application with

```sh
npm run dev
```

The application will run on the `localhost:5000` and if any issue occure such as already used port, make sure to disable airplay (for mac users) on the sharing configuration of the OS.

## TESTING

TODO
