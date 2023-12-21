This is a microblogging application created using NodeJS! The application theme is a book review blogging site.

In order to run this site, you will need to have a MySQL database that has the tables configured as shown in schema.sql and the details in data.js must be modified to create a connection pool.
Once the database is set up and all of the required packages are installed, the website should be ready to run.
To lauch the server, use the following command:

node server.js

The server should now be running! To visit the webpage, go to the address printed in the console.

Features include:
- Ability to view posts made by other users
- Ability to sign up and log in with a unique username and encrypted password
- User session tracking
- Ability to create, edit, and delete your own posts when logged in
- Ability to sort posts by likes or by most recent
- Ability to like posts when logged in
- Pagination features
- Persistant data storage using MySQL
- Posts maintain a like count
- Media resize features for mobile integration


Important Endpoints:
- GET "/" - displays main page that shows posts, no log in required(NLiR)
- GET "/login" - displays login page, NLiR
- GET "/create_account" - displays page to create account, NLiR
- GET "/post" - displays a screen that allows a user to create a new post, log in required (LiR)
- GET "/edit_post" - displays a screen to edit a post, LiR
- GET "/account" - displays posts made by the user, LiR
- GET "/signup" - displays the page where users can signup, NLiR
- POST "/login" - posts user credentials and logs the user in, NLiR
- POST "/api/create_account" - posts new user credentials and logs the new user in, NLiR
- POST "/api/like" - like a post, LiR
- POST "/api/post" - posts new post information, LiR
- POST "/api/sort" - toggle between sorting by latest and likes, NLiR
- POST "/api/edit_post" - edits a post, LiR
- POST "/api/logout" - logs a user out of their account, LiR
- DELETE "/api/delete_post" - delete a post, LiR
- GET "*" - displays a 404 page, NLiR

Created Middlewares:
- ./pagination.js - for paging through posts
- ./authentification.js - for session tracking

Tables:
- User credentials:
    - Text Name not null
    - Text Username not null
    - Text Password not null -- should not be plaintext
    - Int id auto_increment not null

- Posts:
    - Int id auto_increment not null
    - Text title not null
    - Text username not null
    - Text post_body not null
    - Timestamp post_time default current_timestamp
    - Foreign key to track user
    - Int likes default 0

- Likes:
    - Int id auto_increment not null
    - Foreign key to track user
    - Foreign key to track post
