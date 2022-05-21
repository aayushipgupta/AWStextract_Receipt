//const AMZSDK = require("aws-sdk")
//import { AnalyzeExpenseCommand } from  "@aws-sdk/client-textract";
//import  { TextractClient } from "@aws-sdk/client-textract";
const aws = require("aws-sdk");

const REGION = "us-east-1"; //e.g. "us-east-1"
// Create SNS service object.
const textractClient = new TextractClient({ region: REGION });


const textract = new AMZSDK.Textract();

var params = {
    Document: {
        Bytes: Buffer.from(encodeImageFileAsURL("Images\image1.png"))
    },
    FeatureTypes: ["FORMS"]
}

const process_text_detection = async () => {
    try {
        const aExpense = new AnalyzeExpenseCommand(params);
        const response = await textractClient.send(aExpense);
        //console.log(response)
        response.ExpenseDocuments.forEach(doc => {
            doc.LineItemGroups.forEach(items => {
                items.LineItems.forEach(fields => {
                    fields.LineItemExpenseFields.forEach(expenseFields =>{
                        console.log(expenseFields)
                    })
                }
                )}
                )      
            }
        )
        return response; // For unit tests.
      } catch (err) {
        console.log("Error", err);
      }
}

function encodeImageFileAsURL(element) {
    let file = element.files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
      document.write('RESULT: ', reader.result);
    }
    reader.readAsDataURL(file);
  }

request = process_text_detection()