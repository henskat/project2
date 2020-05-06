const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

function imageToObject(pic) {
	return {
		id: pic.id,
		image_uri_edited: pic.image_uri_edited,
		image_filters: pic.image_filters,
		image_caption: pic.image_caption,
		image_tags: pic.image_tags,
		created_at: pic.created_at,
		updated_at: pic.updated_at,
	};
}
app.get('/image/:id', (request, response) => {
	const query = 'SELECT image_uri_edited, image_filters, image_caption, image_tags, created_at, updated_at FROM image WHERE is_deleted = 0 and id = ?';
	const params = [request.params.id];
	connection.query(query, params, (error,rows) => {
		response.send({
			ok:true,
			image: rows.map(imageToObject),
		});
	});
});

app.post('/image', (request, response) => {
	const query = 'INSERT INTO image(image_uri_original, image_uri_edited, image_filters, image_caption, image_tags) VALUES (?,?,?,?,?)';
	const params = [request.body.image_uri_original, request.body.image_uri_edited, request.body.image_filters, request.body.image_caption, request.body.image_tags];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
			id: result.insertId,
		});
	});
});

app.patch('/image/:id', (request, response) => {
	const query = 'UPDATE image SET image_uri_edited = ?, image_filters = ?, image_caption = ?, image_tags = ?, updated_at = CURRENT_TIMESTAMP where id = ?';
	const params = [request.body.image_uri_edited, request.body.image_filters,request.body.image_caption, request.body.image_tags, request.params.id];
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
