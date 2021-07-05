const express = require('express');
const dotenv = require('dotenv');
const app = new express();
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url
    })
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    let analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {}
        }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

app.get("/url/sentiment", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    let analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {}
        }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.send("neutral");
    });
});

app.get("/text/emotion", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    let analyzeParams = {
        'html': req.query.text,
        'features': {
            'emotion': {}
        }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

app.get("/text/sentiment", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    let analyzeParams = {
        'html': req.query.text,
        'features': {
            'sentiment': {}
        }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.send("neutral");
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

