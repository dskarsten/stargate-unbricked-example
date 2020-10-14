# stargate-unbricked-example
Sample app in node.js using Stargate's schemaless API on DataStax Astra to organize your Lego brick sets. The use case is storing documents containing a Lego set's information including the list of required bricks to build it. The usage examples live in the unbricked.test.js file.
It follows the [Stargate Node.js Example](https://github.com/kidrecursive/stargate-nodejs-example).

### Prerequisites
-  NodeJS 12+
-  (Recommended) Setup your local development environment with [nodeenv](#nodeenv)

### Using `nodeenv`

Using [nodeenv](https://github.com/ekalinin/nodeenv) allows you to keep your NodeJS version and dependencies isolated for the project you're 
working on. To get started using it for Stargate NodeJS Example, install it using [homebrew](https://formulae.brew.sh/formula/nodeenv) or `easy_install`.
```sh
# install using homebrew
brew install nodeenv

# install using easy_install
sudo easy_install nodeenv
```

Once nodeenv is installed, setup a virtualenv in the project root folder, and then activate it.
```sh
# setup a nodeenv in the venv folder using NodeJS 12
nodeenv venv --node=12.18.3

# activate the nodeenv
. venv/bin/activate

# install dependencies
npm install
```

### Running the Stargate Unbricked Example

Make sure the package dependencies are installed (you should be using nodeenv as described above)
```sh
# install dependencies
npm install
```

Then, create a `.env` file in the project root that is copied from `.env-template`. Add in your Astra specific credentials.

Once your `.env` file is setup, you can run the tests to try out Stargate
```sh
# run the unit tests
npm test
```

### Using the example

The unbricked.test.js file contains a few test functions.
First it creates a sample document for a set consisting of two types of bricks.
Then it reads the same kind of JSON description of a Lego set from all .json files in the sets/ subfolder and creates a document per file in the database.
Lastly it retrieves one of the documents by the product number and lists all reuqired brick types with their design ID, their name and colour.

### Known issues
The creation of the documents from the files found in the sets/ subfolder is marked to be skipped by mocha. The creation of documents should only be executed once. If they shall rerun, the documents need to be deleted first - the easiest way is to go into the CQL console of Astra and run "truncate <namespacename>.<collectionname>". You use the same names for namespace and collection that you have entered into the .env file. 

You can add additional files or use the `stargate.js` file in your own app as a simple client.

