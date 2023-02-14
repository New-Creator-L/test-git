<template>
  <el-row :gutter="10">
      <el-col :span="12">
          <Left></Left>
      </el-col>
      <el-col :span="12">
          <Right></Right>
      </el-col>
  </el-row>
</template>

<script>
    import Left from './Left'
    import Right from './Right'
    export default {
        name:'Observe',
        components:{Left,Right}
    }
</script>

<style>

</style>