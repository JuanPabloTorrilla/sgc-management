const app = require('./src/app')
//Starting the server
app.listen(app.get('port'), () => {
    console.log(app.get('port'));
});