const express = require('express')
const app = express()
const cors = require('cors')
const uuid = require('uuid')
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')
const WebSocketServer = require('ws').Server
const port = 8500

app.use(cors())

const server = app.listen(port, () => {
    console.log('listening on port ' + port)
})

var database
let clients = []

sqlite
    .open({ driver: sqlite3.Database, filename: 'database.sqlite' })
    .then((database_) => {
        database = database_
    })

const wss = new WebSocketServer({ server: server })

wss.on('connection', (socket, request) => {

    console.log(request.socket.remoteAddress + ' has connected')
    console.log('Clients conntected: ' + wss.clients.size)

    clients.push(socket)

    socket.onmessage = (message) => {
        let data = JSON.parse(message.data)
        console.log(data)

        if (data.status === 1) {
            console.log(data.msg)
        } else if (data.status === 2) {
            like(data, 2)
        } else if (data.status === 3) {
            comment(data, 3)
        } else if (data.status === 4) {
            deleteComment(data, 4)
        }
    }

    socket.onclose = () => {

        console.log(request.socket.remoteAddress + ' has disconnected')
        console.log('Clients conntected: ' + wss.clients.size)

        // Remove socket from client list
        clients.splice(clients.indexOf(socket), 1)

        // Close socket
        socket.close()
    }
})

app.get('/images', (req, res) => {

    getImages(req.get('CurrentPage'))
        .then((images) => {
            res.send(JSON.stringify({ status: 1, data: images }))
        })
})

function getImages(currentPage) {

    return new Promise((resolve, reject) => {
        database.all('SELECT * FROM images ORDER BY imageId DESC LIMIT 5 OFFSET ?', [currentPage * 5])
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

                            if (imageData[j].commentImageId === images[i].imageId && !comments.some(comment => comment.commentId === imageData[j].commentId)) {
                                comments.push({ commentId: imageData[j].commentId, commentUserId: imageData[j].commentUserId, commentMessage: imageData[j].commentMessage })
                            }
                        }

                        images[i].likes = likes
                        images[i].comments = comments.sort((a, b) => a.commentId - b.commentId)
                    }

                    resolve(images)
                })
        })
    })
}

function like(data, status) {

    database.all('SELECT * FROM likes WHERE likeImageId=?', [data.likeImageId])
        .then((likes) => {

            let likeData = { status: status, likeImageId: data.likeImageId, likeUserId: data.likeUserId }

            if (likes !== undefined && likes.some(like => like.likeUserId === data.likeUserId)) {
                database.run('DELETE FROM likes WHERE (likeUserId=? AND likeImageId=?)', [data.likeUserId, data.likeImageId])
                    .then(() => {
                        clients.forEach((client) => {
                            likeData.isLiking = false
                            client.send(JSON.stringify(likeData))
                        })
                    })
            } else {
                database.run('INSERT INTO likes (likeImageId, likeUserId) VALUES (?, ?)', [data.likeImageId, data.likeUserId])
                    .then(() => {
                        clients.forEach((client) => {
                            likeData.isLiking = true
                            client.send(JSON.stringify(likeData))
                        })
                    })
            }
        })
}

function comment(data, status) {

    const token = uuid.v4()

    database.run('INSERT INTO comments (commentId, commentImageId, commentUserId, commentMessage) VALUES (?, ?, ?, ?)', [token, data.commentImageId, data.commentUserId, data.commentMessage])
        .then((comment) => {

            console.log(comment)
            clients.forEach((client) => {
                client.send(JSON.stringify({ status: status, commentId: token, commentImageId: data.commentImageId, commentUserId: data.commentUserId, commentMessage: data.commentMessage }))
            })
        })
}

function deleteComment(data, status) {

    database.run('DELETE FROM comments WHERE (commentId=?)', [data.commentId])
        .then(() => {
            clients.forEach((client) => {
                client.send(JSON.stringify({ status: status, imageId: data.imageId, commentId: data.commentId }))
            })
        })
}