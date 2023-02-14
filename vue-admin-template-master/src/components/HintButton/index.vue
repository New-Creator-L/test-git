<template>
  <a :title="title" style="margin:10px">
      <!-- $listeners可以监听到传递给组件的事件监听器(即绑定的事件) -->
      <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
    export default {
        name:'HintButton',
        props:['title']
    }
</script>

<style>

</style>