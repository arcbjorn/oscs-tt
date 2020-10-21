<template lang="pug">
.container.mx-auto#app
  router-link(to="/") Home |
  router-link(to="/about")  About
router-view(v-slot="slotProps")
  transition(name="route" mode="out-in")
    component(:is="slotProps.Component")
</template>

<style lang="stylus">
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  margin-top 60px

.route-enter-from,
.route-leave-to
  opacity: 0
  transform: translateY(-30px)

.route-enter-active,
.route-leave-active
  transition: all 0.3s ease

.route-enter-to,
.route-leave-from
  transform: translateY(0)
</style>

<style src="./assets/tailwind.css"></style>
