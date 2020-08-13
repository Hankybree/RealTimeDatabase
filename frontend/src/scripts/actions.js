import { client } from './client.js'

export const actions = {
    connect(context) {
        client.connect(context)
    },
    like: (context, imageId) => {
            context.state.socket.send(JSON.stringify({ status: 2, likeImageId: imageId, likeUserId: context.state.userId}))
    }
}