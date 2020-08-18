import Vue from 'vue'

export const client = {
    connect: (context) => {
        context.commit('setSocket', new WebSocket('ws://localhost:8500'))

        context.state.socket.onopen = () => {
            console.log('Connected to server')

            client.sendMessage(context.state.socket, { msg: 'Hello server', status: 1 })
        }

        context.state.socket.onmessage = (message) => {
            
            let data = JSON.parse(message.data)

            console.log(data)

            if (data.status === 1) {
                context.commit('setImages', data.data)
            } else if (data.status === 2 || data.status === 3 || data.status === 4) {

                for (let i = 0; i < context.state.images.length; i++) {
                    for (let j = 0; j < data.data.length; j++) {
                        if (context.state.images[i].imageId === data.data[j].imageId) {
                            if(data.status === 2) {
                                Vue.set(context.state.images[i], 'likes', data.data[j].likes)
                            } else if (data.status === 3 || data.status === 4) {
                                Vue.set(context.state.images[i], 'comments', data.data[j].comments)
                            }
                        }
                    }
                }
                
                //context.commit('setExplorerId', context.state.explorerId + 1)
            }
            
        }

        context.state.socket.onclose = () => {
            console.log('Disconnected from server')
        }
    },
    sendMessage: (socket, message) => {
        socket.send(JSON.stringify(message))
    },
    readMessage: () => {

    },
    disconnect: () => {
        
    }
}