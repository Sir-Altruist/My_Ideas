const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const app = express();

const PORT = process.env.PORT || 5000;

//DB Config
const db = require('./config/database')

//connect database to mongoose
mongoose.connect(db.mongoURI,
{ useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then(() => console.log('Database successfully connected!'))
.catch(err => console.log(err))

//Middleware for processing form submission
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Middleware for method-override
app.use(methodOverride('_method'));

//Config file
require('./config/passport')(passport)

//Middleware for sessions
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
}))

//Middleware for constantly authorizing logged in user
//Note: This must always come after the middleware session above. Else, it won't work
app.use(passport.initialize());
app.use(passport.session());

//Middleware for Flash
app.use(flash())

//Global variables for flash message
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next();
})

//Middleware for express-handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

//Middleware for routes
app.use('/ideas', require('./routes/idea'));
app.use('/users', require('./routes/users'))



//Homepage
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    });
});
//About Page
app.get('/about', (req, res) => {
    res.render('about')
});



//Listening to a port on the browser
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});