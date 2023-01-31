<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{ msg: string }>()
const count = ref(0)
function getData() {
  fetch('/api/users', {
    method: 'post'
  }).then((res) => {
    console.log(res, 'res');
  }).catch((error) => {
    console.log(error, 'error');
  })
}
onMounted(() => {
  getData()
})
</script>

<template>
  <h1 class="read-the-docs">测试1234567</h1>
</template>

<style scoped lang="less">
.read-the-docs {
  color: red;
  fill: aquamarine;
  user-select: none;
  display: flex;

}
</style>
