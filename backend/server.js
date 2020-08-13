const express = require('express')
const app = express()
const cors = require('cors')
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')
const WebSocketServer = require('ws').Server

app.use(cors())

const server = app.listen(8500, () => {
    console.log('listening on port 8000')
})

var database

sqlite
    .open({ driver: sqlite3.Database, filename: 'database.sqlite' })
    .then((database_) => {
        database = database_
    })

const wss = new WebSocketServer({ server: server })

wss.on('connection', (socket, request) => {
    sendInitialData(socket)

    socket.onmessage = (message) => {
        let data = JSON.parse(message.data)
        console.log(data)

        if (data.status === 1) {
            console.log(data.msg)
        } else if (status === 2) {
            
        }
    }
})

function sendInitialData(socket) {

    database.all('SELECT * FROM images')
        .then((images) => {

            database.all('SELECT * FROM images LEFT JOIN likes ON images.imageId = likes.likeImageId LEFT JOIN comments ON images.imageId = comments.commentImageId')
                .then((imageData) => {

                    for (let i = 0; i < images.length; i++) {

                        let likes = []
                        let comments = []

                        for (let j = 0; j < imageData.length; j++) {

                            if (imageData[j].likeImageId === images[i].imageId && !likes.includes(imageData[j].likeUserId)) {
                                likes.push(imageData[j].likeUserId)
                            }

                            if (imageData[j].commentImageId === images[i].imageId && !comments.some(comment => comment.id === imageData[j].commentId)) {
                                comments.push({ id: imageData[j].commentId, user: imageData[j].commentUserId, comment: imageData[j].commentMessage })
                            }
                        }

                        images[i].likes = likes
                        images[i].comments = comments
                    }

                    socket.send(JSON.stringify({ status: 1, data: images}))
                })
        })
}

function like(data, socket, isLiking) {

    database.all('SELECT * FROM likes WHERE likeImageId=?', [data.likeImageId])
        .then((likes) => {
            if (likes[0].likeUserId === data.likeUserId) {
                database.run('DELETE FROM likes WHERE likeUserId=?', [data.likeUserId])
                    .then(() => {
                        sendInitialData(socket)
                    })
            } else {
                database.run('INSERT INTO likes (likeImageId, likeUserId) VALUES (?, ?)', [data.likeImageId, likeUserId])
                    .then(() => {
                        sendInitialData(socket)
                    })
            }
        })
}

// imageId, likeImageId, likeUserId, commentUserId, commentMessage