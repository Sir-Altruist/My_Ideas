if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: "mongodb+srv://express:express@altruist.d8eqs.mongodb.net/express_db?retryWrites=true&w=majority"   
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/ideajot-dev"
    }
}