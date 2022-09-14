const { MongoClient, ObjectID} = require("mongodb");

const connectionUrl = 'mongodb://localhost:27017';
const databaseName = 'task-manager';
const id = new ObjectID();
console.log(id.getTimestamp().toLocaleString());

MongoClient.connect(connectionUrl, {UseNewUrlParser: true},(error, client) =>{
    if (error) {
         console.log('Unable to connect database');
    }

    const db = client.db(databaseName);

    db.collection('tasks').updateMany({completed:false},{
        $set:{description:'Hello node js',completed:true}
    }).then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    })
    
})
