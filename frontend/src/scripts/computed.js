export const computed = {
    images: {
        get() {
            return this.$store.state.images
        },
        set(newImages) {
            this.$store.commit('setImages', newImages)
        }
    }
}