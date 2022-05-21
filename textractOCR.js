const AWS = require("aws-sdk")
const fs = require("fs");
const config = require("./config");

var resultOCR = {};
var items = [];
AWS.config.update({
  accessKeyId: config.awsAccesskeyID,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion
});

const textract = new AWS.Textract();
var datafs = fs.readFileSync("Images/image.jpeg");
var detectParam = {
    Document:{
        Bytes:Buffer.from(datafs),
    }
}
var detectParams = {
    Document:{
        Bytes:Buffer.from(datafs),
    },
    FeatureTypes: ["FORMS"]
} 

requests = textract.analyzeDocument(detectParams, (err, data) => {
    if(err){
        console.log(err);
        return err;
    }
    else{
        getResult_Old(data);
        console.log(data, null, 2);
    }
});

request = textract.analyzeExpense(detectParam, (err, data) => {
    if(err){
        console.log(err);
        return err;
    }
    else{
        createResult(data.ExpenseDocuments[0]);
        console.log(resultOCR, null, 2);
    }
});

function createResult(objList){
    filterObj(objList.SummaryFields,"VENDOR_NAME");
    getResult(objList.LineItemGroups[0]);
    add(resultOCR,"ITEMS",items);
}

function getResult(objList) {
    var count = 0;
    return objList.LineItems.filter(function(obj) { 
        count++;
        var itemSingleArr = [];
         obj.LineItemExpenseFields.filter(function(item){
            var itemSingle = {};
            if(item.Type.Text == "ITEM"){
                add(itemSingle,"NAME",item.ValueDetection.Text)
                add(itemSingle,"CONFIDENCE",item.ValueDetection.Confidence)
                itemSingleArr.push(itemSingle);
            }
            else if(item.Type.Text == "QUANTITY"){
                add(itemSingle,"QUANTITY",item.ValueDetection.Text)
                add(itemSingle,"CONFIDENCE",item.ValueDetection.Confidence)
                itemSingleArr.push(itemSingle);
            }
            else if (item.Type.Text == "PRICE"){
                add(itemSingle,"PRICE",item.ValueDetection.Text)
                add(itemSingle,"CONFIDENCE",item.ValueDetection.Confidence)
                itemSingleArr.push(itemSingle);
            }
     });
     var itemExpense = {};
     add(itemExpense,"ITEM"+count,itemSingleArr);
     items.push(itemExpense);
   });
}

function getResult_Old(objList) {
    var key, value;
    return objList.Blocks.filter(function(obj) { 
        
         if(obj.BlockType == "LINE"){
            if(isGoodDate(obj.Text))
                add(resultOCR,"DATE",obj.Text);
         }
   });
}

function filterObj(objList,filterName){
    return objList.filter(function(item){
        if(item.Type.Text == filterName)
            add(resultOCR,item.Type.Text,item.ValueDetection.Text)
    });
}
   function add(itemList, key, value) {
        itemList[key] = value;
    }
    function isGoodDate(dt){
        var reGoodDate = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)[0-9]{2})$/;
        return reGoodDate.test(dt);
    }

    const isDate = (date) => {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
      }