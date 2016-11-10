'use strict'

// call the packages we need
const express    = require('express')
const https      = require('https')    
const bodyParser = require('body-parser')
const fs         = require('fs')
const ejs        = require('ejs')
const app        = express()

const YotiClient = require('yoti-node-sdk')


const port = process.env.PORT || 9443

// CLIENT_SDK_ID: This is generated by https://www.yoti.com/dashboard when you create your app
const CLIENT_SDK_ID = 'your-application-id'
const PEM = fs.readFileSync(__dirname + "/keys/your-application-pem-file.pem");
var yotiClient = new YotiClient(CLIENT_SDK_ID, PEM)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



// ROUTES FOR OUR WEB APPLICATION
// =============================================================================
var router = express.Router()              // get an instance of the express
											// Router

router.get('/login', function(req, res) {
  res.render('pages/index')
})

router.get('/profile', function(req, res) {
	let token = req.query.token
	if(!token) {
		res.render('pages/error', {
			error : "No token has been provided."
		});
		return
	}
	let promise = yotiClient.getActivityDetails(token)
	promise.then((activityDetails) => {
		res.render('pages/profile', {
			userId  : activityDetails.getUserId(),
			profile : activityDetails.getUserProfile(),
			outcome : activityDetails.getOutcome()
		})
	}).catch((err) => {
		console.error(err)
		res.render('pages/error', {
			error : err
		});
		return
	})
	
})


app.use('/', router)

// START THE SERVER
// =============================================================================
https.createServer({
  key: fs.readFileSync(__dirname + '/keys/server-key.pem'),
  cert: fs.readFileSync(__dirname + '/keys/server-cert.pem')
}, app).listen(port);

console.log('Magic happens on port ' + port)