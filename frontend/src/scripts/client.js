// import Vue from 'vue'

export const client = {
    connect: (context) => {
        context.commit('setSocket', new WebSocket('ws://localhost:8500'))

        context.state.socket.onopen = () => {

            console.log('Connected to server')

            context.state.socket.send(JSON.stringify({ msg: 'Hello server', status: 1 }))
        }

        context.state.socket.onmessage = (message) => {

            let data = JSON.parse(message.data)

            console.log(data)

            client.checkStatus(context, data)
        }

        context.state.socket.onclose = () => {
            console.log('Disconnected from server')
        }
    },
    checkStatus(context, data) {
        if (data.status === 1) {
            context.commit('setImages', data.data)
        } else if (data.status === 2) {
            client.like(context, data)
        } else if (data.status === 3) {
            client.comment(context, data)
        } else if (data.status === 4) {
            client.deleteComment(context, data)
        }
    },
    like(context, data) {
        if (data.isLiking) {
            context.state.images.find(image => image.imageId === data.likeImageId).likes.push(data.likeUserId)
        } else {
            let likeArray = context.state.images.find(image => image.imageId === data.likeImageId).likes
            likeArray.splice(likeArray.indexOf(data.likeUserId), 1)
        }
    },
    comment(context, data) {
        context.state.images.find(image => image.imageId === data.commentImageId).comments.push({ commentId: data.commentId, commentUserId: data.commentUserId, commentMessage: data.commentMessage })
    },
    deleteComment(context, data) {
        let commentArray = context.state.images.find(image => image.imageId === data.imageId).comments
        commentArray.splice(commentArray.indexOf(commentArray.find(comment => comment.commentId === data.commentId)), 1)
    }
}