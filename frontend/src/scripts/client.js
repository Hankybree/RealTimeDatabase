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

            if (data.status === 1) {
                context.commit('setImages', data.data)
            } else if (data.status === 2 || data.status === 3 || data.status === 4) {

                if(data.status === 2) {
                    client.like(context, data)
                } else if (data.status === 3) {
                    client.comment(context, data)
                } else if (data.status === 4) {
                    client.deleteComment(context, data)
                }

                // for (let i = 0; i < context.state.images.length; i++) {
                //     for (let j = 0; j < data.data.length; j++) {
                //         if (context.state.images[i].imageId === data.data[j].imageId) {
                //             if(data.status === 2) {
                //                 Vue.set(context.state.images[i], 'likes', data.data[j].likes)
                //             } else if (data.status === 3 || data.status === 4) {
                //                 Vue.set(context.state.images[i], 'comments', data.data[j].comments)
                //             }
                //         }
                //     }
                // }
            }
            
        }

        context.state.socket.onclose = () => {
            console.log('Disconnected from server')
        }
    },
    like(context, data) {
        if(data.isLiking) {
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
        // console.log(commentArray.find(comment => comment.commentId === data.commentId))
        let commentArray = context.state.images.find(image => image.imageId === data.imageId).comments
        commentArray.splice(commentArray.indexOf(commentArray.find(comment => comment.commentId === data.commentId)), 1)
    }
}