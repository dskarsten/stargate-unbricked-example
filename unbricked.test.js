const assert = require("assert");
const faker = require("faker");
const stargate = require("./stargate");
const _ = require("lodash");

// setup envars
require("dotenv").config();

const path = require('path');
const fs = require('fs');

var readContent = function (path, callback) {
  fs.readFile(path, 'utf8', function (err, content) {
      if (err) return callback(err)
      callback(null, content)
  })
};

function readFilesAsync(dirname, onFileContent, onFinish, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
    } else {
      // keep track of how many we have to go.
      var remaining = filenames.length;
      if ( remaining == 0 ) {
        console.log("No files found.");
      }
      for ( var i = 0; i < filenames.length; i++ ) {
        let filename = path.parse(filenames[i]).name;
        if (path.parse(filenames[i]).ext == ".json") {
          fs.readFile( dirname + filenames[i], 'utf8', function( err, content ) {
            if (err) {
              onError(err);
            } else {
              onFileContent(filename, content);
            }
          });
        }
        remaining -= 1;
        if ( remaining == 0 ) {
          console.log("Done reading files.");
          onFinish(filename);
        }
      };
    }  
  });
};




describe("Unbricked Playthrough", () => {
  // setup test context
  let stargateClient = null;
  const namespace = process.env.ASTRA_KEYSPACE;
  const collection = "sets";
  const dirname = process.env.JSON_DIR;
  var setId = "10214";
  var docRootPath = `/namespaces/${namespace}/collections/${collection}/${setId}`;

  before(async () => {
    stargateClient = await stargate.createClient({
      baseUrl: `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com`,
      username: process.env.STARGATE_USERNAME,
      password: process.env.STARGATE_PASSWORD,
    });
  });

  it.skip("should create a set document", async () => {
    setId = "10020";
    docRootPath = `/namespaces/${namespace}/collections/${collection}/${setId}`;

    await stargateClient.put(docRootPath, {
      Product: {
        ProductNo: `${setId}`,
        ProductName: "Bridge Elements",
        ItemNo: "4174365",
        Asset: "/images/shop/prod/10045-0000-xx-12-1.jpg"
      },
      Bricks: [
        {
          ItemNo: 4142884,
          ItemDescr: "LATTICE 2X16X1.2/3",
          ColourLikeDescr: "Black",
          ColourDescr: "BLACK",
          MaingroupDescr: "Bricks, Special",
          Asset: "/media/bricks/4/2/4142884.jpg",
          MaxQty: 200,
          Ip: false,
          Price: -1,
          CId: "GBP",
          SQty: 0,
          DesignId: 30518,
          PriceStr: "",
          PriceWithTaxStr: "",
          ItemUnavailable: false,
          UnavailableLink: null,
          UnavailableReason: null
        },
        {
          ItemNo: 4142861,
          ItemDescr: "LATTICE TOWER 2X2X10",
          ColourLikeDescr: "Black",
          ColourDescr: "BLACK",
          MaingroupDescr: "Bricks, Special",
          Asset: "/media/bricks/5/2/4142861.jpg",
          MaxQty: 200,
          Ip: false,
          Price: -1,
          CId: "GBP",
          SQty: 0,
          DesignId: 30517,
          PriceStr: "",
          PriceWithTaxStr: "",
          ItemUnavailable: false,
          UnavailableLink: null,
          UnavailableReason: null
        },
        {
          ItemNo: 4141769,
          ItemDescr: "PLATE 2X10",
          ColourLikeDescr: "Grey",
          ColourDescr: "DK.GREY",
          MaingroupDescr: "Bricks, Special",
          Asset: "/media/bricks/5/2/4141769.jpg",
          MaxQty: 200,
          Ip: false,
          Price: -1,
          CId: "GBP",
          SQty: 0,
          DesignId: 3832,
          PriceStr: "",
          PriceWithTaxStr: "",
          ItemUnavailable: false,
          UnavailableLink: null,
          UnavailableReason: null
        }
      ]
    });

    const res = await stargateClient.get(docRootPath);
    assert.equal(res.jsonResponse.data.Product.ProductNo, `${setId}`);
    
  });

  it.skip("should create set documents from files", async () => {
    fs.readdirSync(dirname).forEach(file => {
      if (path.parse(file).ext == ".json") {
        let filename = path.parse(file).name;
        console.log(`Creating document ${filename}`);
        let res = fs.readFileSync(`${dirname}/${file}`, 'utf8');
        let docRootPath = `/namespaces/${namespace}/collections/${collection}/${filename}`;
        const fileData = JSON.parse(res.toString());
        stargateClient.put(docRootPath, fileData);
      }
    });
  });



  it("should get a set document", async () => {

    let setId = "10063";
    let docRootPath = `/namespaces/${namespace}/collections/${collection}/${setId}`;
    const res = await stargateClient.get(docRootPath);
    //console.log("res", res);
    console.log('Product No: ', res.jsonResponse.data.Product.ProductNo, ', Product Name: ', res.jsonResponse.data.Product.ProductName);
    for (var i = 0, len = res.jsonResponse.data.Bricks.length; i < len; i++) {
      let brick = res.jsonResponse.data.Bricks[i];
      console.log('ID: ', brick.DesignId, ', Item: ', brick.ItemDescr, ', Colour: ', brick.ColourLikeDescr);
    };
    assert.equal(res.jsonResponse.data.Product.ProductNo, `${setId}`);
  });    

});
