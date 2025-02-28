import { SQL } from "bun";

export const db = new SQL({
	// Required
	url: "postgres://user:pass@localhost:5432/dbname",

	// Optional configuration
	hostname: "localhost",
	port: 5432,
	database: "myapp",
	username: "dbuser",
	password: "secretpass",

	// Connection pool settings
	max: 20, // Maximum connections in pool
	idleTimeout: 30, // Close idle connections after 30s
	maxLifetime: 0, // Connection lifetime in seconds (0 = forever)
	connectionTimeout: 30, // Timeout when establishing new connections

	// SSL/TLS options
	tls: true,
	// tls: {
	//   rejectUnauthorized: true,
	//   requestCert: true,
	//   ca: "path/to/ca.pem",
	//   key: "path/to/key.pem",
	//   cert: "path/to/cert.pem",
	//   checkServerIdentity(hostname, cert) {
	//     ...
	//   },
	// },

	// Callbacks
	onconnect: (client) => {
		console.log("Connected to database");
	},
	onclose: (client) => {
		console.log("Connection closed");
	},
});
