-- DROP TABLE IF EXISTS comments;
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    content TEXT not null,
    commenter_email TEXT not null,
    commenter_name TEXT not null,
    post_id INTEGER not null,
    parent_id INTEGER,
    user_ip TEXT
);
