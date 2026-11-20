import Database from "better-sqlite3";
const db = new Database(process.env.DATABASE_PATH || "data.db");
db.exec(`create table if not exists users(id integer primary key, email text unique, hash text, plan text default 'free', customer text, created integer default (strftime('%s','now')));
create table if not exists scripts(id integer primary key, user_id integer, tone text, input text, output text, created integer default (strftime('%s','now')));`);
export default db;
