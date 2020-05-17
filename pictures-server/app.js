const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

function imageToObject(pic) {
	const buffer = fs.readFileSync(__dirname + '/stored-images/' + pic.image_uri_edited);
	const base64 = new Buffer(buffer, 'binary').toString('base64');
	const dataUrl = 'data:image/png;base64,' + base64;
	return {
		id: pic.id,
		image_uri_original: dataUrl,
		image_uri_edited: pic.image_uri_edited,
		image_filters: pic.image_filters,
		image_caption: pic.image_caption,
		image_tags: pic.image_tags,
		image_fit: pic.image_fit,
		created_at: pic.created_at,
		updated_at: pic.updated_at,
	};
}
app.get('/image/:filter', (request, response) => {
	let query;
	let params;
	if(request.params.filter !== "none") {
		     params = [request.params.filter];
		     query = 'SELECT id, image_uri_edited, image_filters, image_caption, image_tags, created_at, updated_at, image_fit FROM image WHERE is_deleted = 0 AND image_uri_edited != "" AND image_tags = ? ORDER BY updated_at DESC';
	} else {
		params = [];
		query = 'SELECT id, image_uri_edited, image_filters, image_caption, image_tags, created_at, updated_at, image_fit FROM image WHERE is_deleted = 0 AND image_uri_edited != "" ORDER BY updated_at DESC';
	}
	connection.query(query, params, (error,rows) => {
		response.send({
			ok:true,
			image: rows.map(imageToObject),
		});
	});
});

app.post('/image/', (request, response) => {
	const query = 'INSERT INTO image(image_uri_edited, image_filters, image_fit, image_caption, image_tags) VALUES (?,?,?,?,?)';
	const params = [request.body.image_uri_edited, request.body.image_filters, request.body.image_fit,  request.body.image_caption, request.body.image_tags];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
			id: result.insertId,
		});
	});
});


app.post('/upload/', function(req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}
	const image = req.files.myFile;
	const path = __dirname + '/stored-images/' + image.name;
	image.mv(path, function(error) {
		if(error) {
			return res.status(500).send(error);
		}
		console.log("moved");
	});
});

app.patch('/image/:id', (request, response) => {
	const query = 'UPDATE image SET image_uri_edited = ?, image_filters = ?, image_caption = ?, image_tags = ?, image_fit = ?,  updated_at = CURRENT_TIMESTAMP where id = ?';
	const params = [request.body.image_uri_edited, request.body.image_filters,request.body.image_caption, request.body.image_tags, request.body.image_fit, request.params.id];
	connection.query(query, params, (error,result) => {
		response.send({
			ok: true,
		});
	});

});

app.delete('/image/:id', (request, response) => {
        const query = 'UPDATE image SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const params = [request.params.id];
        connection.query(query, params, (error,result) => {
                response.send({
                        ok: true,
                });
        });

});


const port = 3443;
app.listen(port,() => {
	console.log('We are live on port');
});
