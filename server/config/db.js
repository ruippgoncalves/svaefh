const mongoose = require('mongoose');

// Connect to mongoDB
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        });

        console.log('Ligação à base de dados estabelecida com sucesso')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;
