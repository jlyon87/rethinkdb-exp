const rDB = require("rethinkdb");

const config = {
	host: "localhost",
	port: 28015,
	db: 'test'
};

const logData = (data, name) => {
	console.log(name, JSON.stringify(data, null, 2));
};

const connectRethinkDB = () => {
	return rDB.connect(config)
};

const queryAllTvShows = conn => {
	return rDB.table('tv_shows').run(conn);
};

const queryAllAuthors = conn => {
	return rDB.table('authors').run(conn);
};

const queryAuthorsByName = (authorNames, conn) => {
	return rDB.table('authors')
		.filter(author => {
			return rDB.expr(authorNames).contains(author("name"));
		})
		.run(conn)
};

const closeDbConnection = conn => {
	conn.close();
};

connectRethinkDB()
.then(conn => {

	queryAllTvShows(conn)
		.then(cursor => cursor.toArray())
		.then(data => logData(data, "all tv shows"))
		.catch(console.error);

	queryAllAuthors(conn)
		.then(cursor => cursor.toArray())
		.then(data => logData(data, "all authors"))
		.catch(console.error);

	queryAuthorsByName(["William Adama"], conn)
		.then(cursor => cursor.toArray())
		.then(data => logData(data, "authors by name - William Adama"))
		.catch(console.error);

	queryAuthorsByName(["William Adama", "Jean-Luc Picard"], conn)
		.then(cursor => cursor.toArray())
		.then(data => logData(data, "authors by name - William Adama, Jean-Luc Picard"))
		.catch(console.error);

	return conn;
})
.then(closeDbConnection)
.catch(console.error)
