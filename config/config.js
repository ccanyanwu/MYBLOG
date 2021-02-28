
module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./db.development.sqlite"
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  dev: {
    username: "wjyfzehj",
    password: "ReAu56NFoX0MgJ7Y4LJYvz-o9juDhXG2",
    database: "wjyfzehj",
    host: "ziggy.db.elephantsql.com",//postgres://wjyfzehj:ReAu56NFoX0MgJ7Y4LJYvz-o9juDhXG2@ziggy.db.elephantsql.com:5432/wjyfzehj
    dialect: 'postgres' 
  },
  production: {
     
     username: "manifestUser",
     password: "manifestPassword",
     database: "emekaBlogApp",
     host: "manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com",
     dialect: 'postgres' 
  }
};
