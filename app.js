const AWS = require("aws-sdk");


AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8001"
});
const DynamoDB = new AWS.DynamoDB();


function createTable() {
    const params = {
        TableName: "Movies",
        KeySchema: [{ AttributeName: "title", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "title", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };

    DynamoDB.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table", err);
        } else {
            console.log("Created table", data);
        }
    });
}

function addMovie(title, rtScore) {
    const params = {
        TableName: "Movies",
        Item: {
            title: { S: title },
            rtScore: { N: rtScore },
        },
    };

    DynamoDB.putItem(params, function (err) {
        if (err) {
            console.error("Unable to add movie", err);
        } else {
            console.log(`Added ${title} with a Rotten Tomatoes Score of ${rtScore}%`);
        }
    });
}

function getAllMovies() {
    const params = {
        TableName: "Movies",
    };

    DynamoDB.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to find movies", err);
        } else {
            console.log(`Found ${data.Count} movies`);
            console.log(data.Items);
        }
    });
}

function getMovie(title) {
    const params = {
        TableName: "Movies",
        Key: {
            title: { S: title },
        },
    };

    DynamoDB.getItem(params, function (err, data) {
        if (err) {
            console.error("Unable to find movie", err);
        } else {
            console.log("Found movie", data.Item);
        }
    });
}

function updateMovieScore(title, newRtScore) {
    const params = {
        TableName: "Movies",
        Item: {
            title: { S: title },
            rtScore: { N: newRtScore.toString() },
        },
        ReturnConsumedCapacity: "TOTAL",
    };

    DynamoDB.putItem(params, function (err) {
        if (err) {
            console.error("Unable to find movie", err);
        } else {
            console.log(`Updated ${title} with new RT Score of ${newRtScore}%`);
        }
    });
}

function deleteMovie(title) {
    const params = {
        TableName: "Movies",
        Key: {
            title: { S: title },
        },
    };

    DynamoDB.deleteItem(params, function (err) {
        if (err) {
            console.error("Unable to find movie", err);
        } else {
            console.log(`Deleted ${title}`);
        }
    });
}

module.exports = {
    createTable,
    addMovie,
    getAllMovies,
    getMovie,
    updateMovieScore,
    deleteMovie
};