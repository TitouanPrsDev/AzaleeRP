create table inventories
(
    players_id_FK varchar(20) not null,
    items_id_FK   int         not null,
    constraint inventories_ibfk_1
        foreign key (players_id_FK) references players (id),
    constraint inventories_ibfk_2
        foreign key (items_id_FK) references items (id)
)
    charset = utf8;

create index items_id_FK
    on inventories (items_id_FK);

create index players_id_FK
    on inventories (players_id_FK);

create table items
(
    id    int auto_increment
        primary key,
    name  varchar(255) not null,
    price int          not null
)
    charset = utf8;

create table money
(
    players_id_FK varchar(20)   not null
        primary key,
    cash          int default 0 not null,
    bank          int default 0 not null,
    constraint money_ibfk_1
        foreign key (players_id_FK) references players (id)
)
    charset = utf8;

create table players
(
    id varchar(20) not null
        primary key
)
    charset = utf8;

-- auto-generated definition
create table quests
(
    id           int auto_increment
        primary key,
    name         varchar(255) not null,
    objective    varchar(255) not null,
    reward_money varchar(255) not null,
    reward_item  varchar(255) not null,
    date         varchar(10)  not null
)
    charset = utf8;


