const path = require(`path`)
const express = require(`express`)
const sequelize = require(`./config/connection`)
const session = require(`express-session`)
const exphbs = require(`express-handlebars`)
const routes = require(`./controllers`)
const helpers = require(`./utils/helpers`)


// Create a new sequelize store using the express-session package
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const app = express();
const PORT = process.env.PORT || 3001

const hbs = exphbs.create({ helpers })

// Configure and link a session object with the sequelize store
const sess = {
  secret: process.env.SECRET,
  cookie: {
    expires: 22 * 60 * 1000 //session expires after 22 minutes
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// Add express-session and store as Express.js middleware
app.use(session(sess));

app.engine(`handlebars`, hbs.engine);
app.set(`view engine`, `handlebars`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));

app.use(routes);
//sync sequalize w/ db then start server operation
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
