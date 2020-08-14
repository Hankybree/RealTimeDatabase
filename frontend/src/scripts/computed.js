export const computed = {
    images: {
        get() {
            return this.$store.state.images
        },
        set(newImages) {
            this.$store.commit('setImages', newImages)
        }
    },
    message: {
        get() {
            return this.$store.state.message
        },
        set(newMessage) {
            this.$store.commit('setMessage', newMessage)
        }
    }
}