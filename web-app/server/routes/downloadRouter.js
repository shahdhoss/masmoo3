const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/',async (req,res)=>{
    try{
        const {url} = req.query;
        console.log(url); 
        const response = await axios.get(url,{responseType: 'arraybuffer'})
        res.set({
            'Content-Type':'audio/mpeg',
            'Content-Length':response.headers['content-length'],
            'Accept-Ranges':'bytes'
        });
        res.send(response.data);
    } catch(err){
        res.status(500).json({error: 'failed to fetch data'})
        console.log(err)
    }
})

module.exports = router;