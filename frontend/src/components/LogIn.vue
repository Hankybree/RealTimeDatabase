<template>
  <div class="content">
    <input type="button" value="Log in" @click="login" />
  </div>
</template>

<script>
  export default {
    name: 'LogIn',
    methods: {
      login() {
        console.log('Logged in')
        window.location.replace('http://localhost:8080/#/likecomment')
      }
    }
  }
</script>

<style scoped>
  .content {
    background-color: blue;
  }
</style>
