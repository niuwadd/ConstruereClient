<template>
  <div class="bg-linear-to-b from-[#E4DBED] via-[#E8EADE] to-[#ECDEDF] size-full">
    <!-- <img class="absolute top-[50%] transform-[translateY(-50%)]" :src="Agent_2"> -->
  </div>
</template>
<script lang="ts" setup>
// import Agent_2 from '@/assets/image/02.png'
import { onMounted } from 'vue'
import RecordRTCPromisesHandler from 'recordrtc';
onMounted(() => {
  initRecorder()
})
const initRecorder = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      // 取消回音
      echoCancellation: true,
      // 降噪
      noiseSuppression: true,
      // 采样率
      // sampleRate: 44100,
    },
  })
  const recorder = new RecordRTCPromisesHandler(stream, {
    type: 'audio'
  });
  console.log(recorder);
}
</script>
<style lang="scss" scoped></style>