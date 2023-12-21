create table user (
    id int auto_increment,
    name text not null,
    username varchar(30) not null unique,
    password text not null,
    primary key (id)
);

create table post (
    id int auto_increment,
    user_id int not null,
    title varchar(100) not null,
    author varchar(30) not null,
    body text not null,
    post_time timestamp default current_timestamp,
    likes int default 0,
    primary key (id),
    foreign key (user_id) references user(id)
);

create table likes (
    id int auto_increment,
    user_id int not null,
    post_id int not null,
    primary key (id),
    foreign key (user_id) references user(id),
    foreign key (post_id) references post(id)
);