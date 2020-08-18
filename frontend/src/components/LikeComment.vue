<template>
  <div class="content">
    <div :key="image.imageId" v-for="image in images">
      <div class="image">
        {{ image.imageId }}
        <span class="info">
          Likes: {{ image.likes.length }}
          <br />
          <div v-if="image.likes.includes($store.state.userId)">
            Liked
          </div>
          <div v-else>
            Not liked
          </div>
          <br />
        </span>
        <div class="ui">
          <input
            type="button"
            value="Like"
            @click="$store.dispatch('like', image.imageId)"
          />
          <div class="comments">
            <input v-model="message" placeholder="Comment..." />
            <input
              type="button"
              value="Comment"
              @click="$store.dispatch('comment', image.imageId)"
            />
          </div>
        </div>
        Comments:
        <div :key="comment.commentId" v-for="comment in image.comments">
          {{ comment.commentMessage }}
          <input
            v-if="comment.commentUserId === $store.state.userId"
            type="button"
            value="Delete"
            @click="$store.dispatch('deleteComment', comment.commentId)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed } from '../scripts/computed.js'

  export default {
    beforeCreate() {
      this.$store.dispatch('connect')

      window.addEventListener('scroll', () => {
        this.handleScroll()
      })
    },
    created() {
      this.getImages()
    },
    name: 'LikeComment',
    data() {
      return {
        loading: false
      }
    },
    methods: {
      getImages() {
        fetch('http://localhost:8500/images', {
          headers: {
            CurrentPage: this.$store.state.currentPage
          },
          method: 'GET'
        })
          .then((response) => response.json())
          .then((result) => {
            this.$store.commit('appendImages', result.data)
            this.loading = false
          })
      },
      handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.loading) {
          this.loading = true
          this.$store.commit('setCurrentPage', this.$store.state.currentPage + 1)
          this.getImages()
        }
      }
    },
    computed: computed
  }
</script>

<style scoped>
  .image {
    width: 50vw;
    border: solid 0.5px black;
    border-radius: 1em;
    margin: 5px;
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .ui {
    display: flex;
    flex-direction: column;
    margin: 10px;
    width: 15vw;
  }
  .comments {
    display: flex;
    flex-direction: column;
    margin: 10px auto;
  }
</style>
