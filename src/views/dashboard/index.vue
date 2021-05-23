<template>
  <div class="container">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  height:740px;
  width: auto;
  background-image: url("../../icons/svg/background.jpg");
  background-size: cover;
}
</style>
