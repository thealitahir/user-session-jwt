const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectionURI = process.env.MONGO_URI;

mongoose.connect(connectionURI, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    (err) => {
        if (err) {
            console.log(`Mongo Db connection error ${err}`);
        } else {
            console.log('Mongo Db connection successful...');
        }
    }
    );

    mongoose.Promise = global.Promise;
