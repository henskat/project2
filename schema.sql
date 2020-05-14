DROP TABLE IF EXISTS image;

CREATE TABLE image (
	id SERIAL PRIMARY KEY,
	image_uri_edited TEXT,
	image_filters TEXT,
	image_caption TEXT,
	image_tags TEXT,
	is_deleted INT DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

