<template>
  <div class="content">
    <input type="button" value="Log in" @click="login" />
    <!-- <div id="image-container">
      <div :key="index" v-for="(image, index) in images">
        <img class="image" src="../assets/1.jpg" alt="">
        <img class="image2" src="../assets/2.jpg" alt="">
      </div>
    </div> -->
  </div>
</template>

<script>
  export default {
    name: 'LogIn',
    data() {
      return {
        counter: 0,
        images: [1,2,3,4,5,6,7,8,9,10]
      }
    },
    methods: {
      login() {
        console.log('Logged in')
        window.location.replace('http://localhost:8080/#/likecomment')
      },
      changeValue() {
        this.$store.commit('setTest', 1)
      }
    }
  }
</script>

<style scoped>
  .content {
    background-color: blue;
  }
  #image-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 0px;
    padding: 0;
  }
  .image {
    width: 19vw;
    margin: 5px;
    padding: 0;
  }
  .image2 {
    width: 19vw;
    margin: 10px 5px;
    padding: 0;
  }
</style>
