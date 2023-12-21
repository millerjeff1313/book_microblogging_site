const express = require('express');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const {checkStatus} = require("./authentification.js");
const {pagination} = require("./pagination.js");
const {addUser, getUserByUsername, getUserByUsernameById, deleteUser, 
    addPost, getPost, getPostsByTime, getPostsByLikes, getPostsByUser, updatePostLikes, updatePost, deletePost,
    addLike, getLikesByUser, getLikesByPost, deleteLike} = require("./data.js");
const app = express();
const port = 4131;

app.set("views", "templates");
app.set("view engine", "pug");
app.use(express.static('resources'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'some-secret-example',
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));


app.get('/', pagination, (req, res) => { // homepage
    let start_index = req.pagination.start_index;
    let end_index = req.pagination.end_index;
    let page_size = req.pagination.page_size;
    let page = req.pagination.page;

    let liked_posts = [];
    if (req.session.userid) {
        getLikesByUser(req.session.userid).then((result) => {
            for (let i = 0; i < result.length; i++) {
                liked_posts.push(result[i].post_id);
            }
        });
    }

    if (req.session.sort_by_time) {
        posts = getPostsByTime().then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (liked_posts.includes(result[i].id)) {
                    result[i].liked = true;
                }
                else {
                    result[i].liked = false;
                }
            }
            let max_page = Math.ceil(result.length / page_size);
            console.log("HTTP GET / - 200 OK - homepage.pug")

            res.render("homepage.pug", {posts: result.slice(start_index, end_index), sorting: "date", page: page, max_page: max_page});
        });
    }
    else {
        posts = getPostsByLikes().then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (liked_posts.includes(result[i].id)) {
                    result[i].liked = true;
                }
                else {
                    result[i].liked = false;
                }
            }
            let max_page = Math.ceil(result.length / page_size);

            console.log("HTTP GET / - 200 OK - homepage.pug")

            res.render("homepage.pug", {posts: result.slice(start_index, end_index), sorting: "likes", page: page, max_page: max_page});
        });
    }
});

app.get('/account', checkStatus, pagination, (req, res) => { // account page
    console.log("HTTP GET /account - 200 OK - account.pug")
    let username = req.session.username;
    let userid = req.session.userid;

    let start_index = req.pagination.start_index;
    let end_index = req.pagination.end_index;
    let page_size = req.pagination.page_size;
    let page = req.pagination.page;

    getPostsByUser(userid).then((result) => {
        let max_page = Math.ceil(result.length / page_size);
        res.render("account.pug", {posts: result.slice(start_index, end_index), page: page, max_page: max_page});
    }).catch((error) => {
        console.log(error);
        res.render("400.pug");
    });
});

app.get('/login', (req, res) => { // login page
    console.log("HTTP GET /login - 200 OK - login.pug")
    res.render("login.pug");
});

app.get('/signup', (req, res) => { // create account page
    console.log("HTTP GET /create_account - 200 OK - create_account.pug")
    res.render("signup.pug");
});

app.get('/post', checkStatus, (req, res) => { // new post page
    console.log("HTTP GET /post - 200 OK - new_post.pug")
    res.render("post.pug");
});

app.get('/edit_post', checkStatus, (req, res) => { // edit post page
    console.log("HTTP GET /edit_post - 200 OK - edit_post.pug")
    let post_id = req.query.post_id;
    let user_id = req.session.userid;

    getPost(post_id).then((result) => {
        let post = result[0];
        if (post.user_id == user_id) {
            res.render("edit_post.pug", {post: post});
        }
        else {
            res.render("400.pug");
        }
    }).catch((error) => {
        console.log(error);
        res.render("400.pug");
    });
});

app.post('/api/edit_post', checkStatus, (req, res) => { // edit post
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;

    if (!title || !body) {
        console.log("HTTP PUT /edit_post - 400 BAD REQUEST - edit_post.pug")
        res.status(400).json({ error: "Missing title and/or body"});
    }

    let post_data = {
        "id": id,
        "title": title,
        "body": body,
    };

    updatePost(post_data).then((result) => {
        console.log("HTTP PUT /edit_post - 200 OK - account.pug")
        res.redirect(303, "/account");
    }).catch((error) => {
        console.log(error);
        res.render("400.pug");
    });
});

app.post('/api/create_account', (req, res) => { // create account
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;

    if (!username || !password || !name) {
        console.log("HTTP POST /create_account - 400 BAD REQUEST - create_account.pug")
        res.status(400).json({ error: "Missing username and/or password"});
    }

    let encrypted = bcrypt.hashSync(password, 10);

    let user_data = {
        "username": username,
        "password": encrypted,
        "name": name,
    };

    addUser(user_data).then((result) => {
        console.log("HTTP POST /create_account - 200 OK - create_account.pug")

        req.session.username = username;
        req.session.sort_by_time = true;

        getUserByUsername(username).then((result) => {
            user = result[0];
            req.session.userid = user.id;
        });

        req.session.save(function(err) {
            if (err) {
                console.log(err);
                res.render("400.pug");
            }
            getPostsByUser(username).then((result) => {
                res.redirect("/account");
            });
        });
    }).catch((error) => {
        console.log(error);
        res.render("400.pug");
    });
});

app.post('/login', (req, res) => { // login
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        console.log("HTTP POST /login - 400 BAD REQUEST - login.pug")
        res.status(400).json({ error: "Missing username and/or password"});
    }

    getUserByUsername(username).then((result) => {
        user = result[0];

        if (bcrypt.compareSync(password, user.password)) {
            req.session.regenerate(function(err) {
                if (err) {
                    console.log(err);
                    res.render("400.pug");
                }

                req.session.username = username;
                req.session.userid = user.id;
                req.session.sort_by_time = true;

                req.session.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("HTTP POST /login - 200 OK - account.pug");
                    getPostsByUser(username).then((result) => {
                        res.redirect("/account");
                    });
                });
            });
        }
    }).catch((error) => {
        console.log(error);
        res.render("400.pug");
    });
});

app.post('/api/post', checkStatus, (req, res) => { // new post
    console.log("HTTP POST /post - 200 OK - homepage.pug")
    let title = req.body.title;
    let body = req.body.body;
    let username = req.session.username;
    let user_id = req.session.userid;

    if (body.length > 500) {
        console.log("HTTP POST /post - 400 BAD REQUEST - new_post.pug")
        res.status(400).json({ error: "Body too long"});
    }

    getUserByUsername(username).then((result) => {
        user = result[0];

        if (!title || !body) {
            console.log("HTTP POST /post - 400 BAD REQUEST - new_post.pug")
            res.status(400).json({ error: "Missing title and/or body"});
        }

        let post_data = {
            "author": username,
            "title": title,
            "body": body,
            "user_id": user_id,
        };
    
        addPost(post_data).then((result) => {
            console.log("Post created: " + title);
            console.log("HTTP POST /post - 200 OK - homepage.pug")
            res.redirect("/");
        }).catch((error) => {
            console.log(error);
            res.render("400.pug");
        });
    });
});

app.post('/api/like', checkStatus, (req, res) => { // like post
    let post_id = req.body.post_id;
    let user_id = req.session.userid;

    getPost(post_id).then((result) => {
        let post = result[0];
        let likes = post.likes;
        let liked = false;

        getLikesByUser(user_id).then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].post_id == post_id) {
                    liked = true;
                    break;
                }
            }
        }).then(() => {
            let message = {};
            if (liked) {
                message["status"] = "unlike";
                message["likes"] = likes - 1;
                deleteLike({"user_id": user_id, "post_id": post_id, "likes": likes - 1}).then((result) => {
                    console.log("HTTP POST /api/like - 200 OK - homepage.pug");
                    res.json(message);
                }).catch((error) => {
                    console.log(error);
                    res.render("400.pug");
                });
            }
            else {
                message["status"] = "like";
                message["likes"] = likes + 1;
                let post_data = {
                    "id": post_id,
                    "likes": likes + 1,
                };

                let like_data = {
                    "user_id": user_id,
                    "post_id": post_id,
                };

                updatePostLikes(post_data).then(addLike(like_data)).then((result) => {
                    console.log("HTTP POST /api/like - 200 OK - homepage.pug");
                    res.json(message);
                }).catch((error) => {
                    console.log(error);
                    res.render("400.pug");
                });
            }
        });
    });
});

app.delete('/api/delete_post', checkStatus, (req, res) => { // delete post
    let id = req.body.id;

    deletePost(id).then((result) => {
        console.log("HTTP DELETE /delete_post - 200 OK - account.pug")
        res.redirect(303, "/account");
    }).catch((error) => {
        console.log(error);
        res.render("400.pug");
    });
});

app.post('/api/sort', (req, res) => { // sort by time
    console.log("HTTP POST /sort_time - 200 OK - homepage.pug")
    let sort = req.body.sort;

    if (sort == "likes") {
        req.session.sort_by_time = false;
    }
    else {
        req.session.sort_by_time = true;
    }

    res.redirect("/");
});

app.post('/api/logout', (req, res) => { // logout
    console.log("HTTP GET /logout - 200 OK - homepage.pug")
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.render("400.pug");
        }
        res.redirect("/");
    });
});

app.get('*', (req, res) => { // 404
    console.log("HTTP GET * - 404 NOT FOUND - 404.pug");
    res.status(404);
    res.render("404.pug");
});

app.listen(port, () => { // listen on port 4131
    console.log(`App listening on port ${port}`);
    console.log("http://localhost:4131/");
});