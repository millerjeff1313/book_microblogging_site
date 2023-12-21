const mysql = require(`mysql-await`); // npm install mysql-await

var connPool = mysql.createPool({
    connectionLimit: 5,
    host: "127.0.0.1",
    user: "",
    database: "",
    password: "",
});

async function addUser(data){
    let query = await connPool.awaitQuery("INSERT INTO user (name, username, password) VALUES (?, ?, ?)", [data.name, data.username, data.password]);
    return query;
}

async function getUserByUsername(username){
    let query = await connPool.awaitQuery("SELECT * FROM user WHERE username = ?", [username]);
    return query;
}

async function getUserById(id){
    let query = await connPool.awaitQuery("SELECT * FROM user WHERE id = ?", [id]);
    return query;
}

async function deleteUser(user_id){
    let post_query = await connPool.awaitQuery("DELETE FROM post WHERE user_id = ?", [user_id]);
    let query = await connPool.awaitQuery("DELETE FROM user WHERE id = ?", [user_id]);
    return query;
}




async function addPost(data){
    let query = await connPool.awaitQuery("INSERT INTO post (user_id, title, body, author) VALUES (?, ?, ?, ?)", [data.user_id, data.title, data.body, data.author]);
    return query;
}

async function getPost(id){
    let query = await connPool.awaitQuery("SELECT * FROM post WHERE id = ?", [id]);
    return query;
}

async function getPostsByTime(){
    let query = await connPool.awaitQuery("SELECT * FROM post ORDER BY post_time DESC");
    return query;
}

async function getPostsByLikes(){
    let query = await connPool.awaitQuery("SELECT * FROM post ORDER BY likes DESC");
    return query;
}

async function getPostsByUser(user_id){
    let query = await connPool.awaitQuery("SELECT * FROM post WHERE user_id = ? ORDER BY post_time DESC", [user_id]);
    return query;
}

async function updatePostLikes(data){
    let query = await connPool.awaitQuery("UPDATE post SET likes = ? WHERE id = ?", [data.likes, data.id]);
    return query;
}

async function updatePost(data){
    let query = await connPool.awaitQuery("UPDATE post SET title = ?, body = ? WHERE id = ?", [data.title, data.body, data.id]);
    return query;
}

async function deletePost(id){
    let query = await connPool.awaitQuery("DELETE FROM post WHERE id = ?", [id]);
    return query;
}

async function addLike(data){
    let query = await connPool.awaitQuery("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [data.user_id, data.post_id]);
    return query;
}

async function getLikesByUser(user_id){
    let query = await connPool.awaitQuery("SELECT * FROM likes WHERE user_id = ?", [user_id]);
    return query;
}

async function getLikesByPost(post_id){
    let query = await connPool.awaitQuery("SELECT * FROM likes WHERE post_id = ?", [post_id]);
    return query;
}

async function deleteLike(data){
    let post_query = await connPool.awaitQuery("UPDATE post SET likes = ? WHERE id = ?", [data.likes, data.post_id]);
    let query = await connPool.awaitQuery("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [data.user_id, data.post_id]);
    return query;
}

module.exports = {addUser, getUserByUsername, getUserById, deleteUser, 
    addPost, getPost, getPostsByTime, getPostsByLikes, getPostsByUser, updatePostLikes, updatePost, deletePost,
    addLike, getLikesByUser, getLikesByPost, deleteLike}