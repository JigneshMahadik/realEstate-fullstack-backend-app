const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const chat = async (req, res) => {
    try{
        const api_key = process.env.OPENAI_API_KEY;
        const resp = await axios({url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api_key}`,
            method : "post",
            data :{
                contents : [
                    {
                        parts : [{
                            text : req.body.message
                        }]
                    }
                ]
            }}
        );
        // console.log("response is :",resp['data']['candidates'][0]['content']['parts'][0]['text']);
        res.json(resp['data']['candidates'][0]['content']['parts'][0]['text']);
    }
    catch(error){
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : 'An error occurred while processing your request.'
        });
    }
}

// Export all the controllers.
const chatControllers = {
    chat
}

module.exports = chatControllers;
