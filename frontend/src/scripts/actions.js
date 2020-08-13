import { client } from './client.js'

export const actions = {
    connect(context) {
        client.connect(context)
    }
}