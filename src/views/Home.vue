<template>
  <van-nav-bar title="Paandaa's" />
  <div class="content">
    <van-empty description="或许，您的网址没有打完整……">
      <van-button type="primary" url="/lightandnight">前往「光夜小工具」</van-button>
    </van-empty>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.van-button {
  margin: 5px 0;
}
</style>
