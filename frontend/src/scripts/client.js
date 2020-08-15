export const client = {
    connect: (context) => {
        context.commit('setSocket', new WebSocket('ws://localhost:8500'))

        context.state.socket.onopen = () => {
            console.log('Connected to server')

            client.sendMessage(context.state.socket, { msg: 'Hello server', status: 1 })
        }

        context.state.socket.onmessage = (message) => {
            
            let data = JSON.parse(message.data)

            context.commit('setImages', data.data)
            console.log(data.data)
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