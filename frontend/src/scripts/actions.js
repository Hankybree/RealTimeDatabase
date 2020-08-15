import { client } from './client.js'

export const actions = {
    connect(context) {
        client.connect(context)
    },
    like: (context, imageId) => {
        context.state.socket.send(JSON.stringify({ status: 2, likeImageId: imageId, likeUserId: context.state.userId }))
    },
    comment: (context, imageId) => {

        context.state.socket.send(JSON.stringify({ status: 3, commentImageId: imageId, commentUserId: context.state.userId, commentMessage: context.state.message }))
    },
    deleteComment(context, commentId) {
        context.state.socket.send(JSON.stringify({ status: 4, commentId: commentId }))
    },
    sendCurrentPage(context) {
        context.state.socket.send(JSON.stringify({ status: 5, currentPage: context.state.currentPage }))
    }
}