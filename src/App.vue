<template lang="pug">
div#app
  router-link(to="/") Home |
  router-link(to="/about") About
router-view
</template>

<style lang="stylus">
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>

<style src="./assets/tailwind.css"></style>
