<template>
  <div class="content">
    <div :key="index" v-for="(image, index) in images">
      <div class="image">
        <span class="info">
          Likes: {{ image.likes.length }}
          <br>
          <div v-if="image.likes.includes($store.state.userId)">
            Liked
          </div>
          <div v-else>
            Not liked
          </div>
          <br>
        </span>
        <div class="ui">
          <input type="button" value="Like" @click="$store.dispatch('like', image.imageId)">
          <div class="comments">
            <input type="text" placeholder="Comment...">
            <input type="button" value="Comment" @click="comment">
          </div>
        </div>
        Comments:
        <div :key="index" v-for="(comment, index) in image.comments">
          {{ comment.comment }}
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
  },
  name: "LikeComment",
  computed: computed,
  methods: {
    comment() {
      
    }
  }
}
</script>

<style scoped>
  .frame {
    width: 19vw;
    height: 19vw;
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