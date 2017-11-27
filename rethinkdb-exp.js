const r = require("rethinkdbdash")({
	host: "localhost",
	port: 28015,
	db: 'test'
});

const logData = data => {
	console.log("data", JSON.stringify(data, null, 2));
};

const closeDbConnection = () => {
	r.getPool().drain();
};

const queryAllTvShows = () => {
	return r.table('tv_shows').run()
};

const queryAllAuthors = () => {
	return r.table('authors').run()
	// .then((conn, cursor) => {
	// 	cursor.toArray()
	// 	.then(data => data);
	// })
};

const queryAuthorsByName = authorNames => {
	return r.table('authors')
	.filter(doc => {
		return r.expr(authorNames).contains(doc("name"));
	})
	.run()
	.then(data => {
		console.log("inner authors by name", JSON.stringify(data, null, 2));
		console.log("inner authors typeof", typeof data);
		return data;
	});
	// .then(data => {
	// 	console.log("authorsByName", JSON.stringify(data, null, 2));
	// 	return data;
	// })
};


queryAllTvShows()
.then(data => {
	console.log("all tv shows", JSON.stringify(data, null, 2));
	console.log("all tv shows typeof", typeof data);
})
.then(queryAllAuthors)
.then(data => {
	console.log("all authors", JSON.stringify(data, null, 2));
	console.log("all authors typeof", typeof data);
})
.then(queryAuthorsByName(["William Adama"]))
.then(data => {
	console.log("authors by name", JSON.stringify(data, null, 2));
})
.catch(err => {
	console.error(err);
})
.finally(closeDbConnection);
