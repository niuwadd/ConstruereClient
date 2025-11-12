<template>
  <div class="flex flex-col gap-4">
   <!--  <div class="flex justify-center">
      <img class="w-1/2" :src="Music" alt="">
    </div> -->
    <div class="flex justify-center">
      <p>{{ musicName }}</p>
      <audio :src="musicUrl" controls autoplay></audio>
    </div>
    <div ref="wavesurferRef"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, toRef, ref } from 'vue';
import WaveSurfer from 'wavesurfer.js'
import Music from '@/assets/image/music.png'
const props = defineProps<{ musicUrl: string, musicName: string }>()
const musicUrl = toRef(props, 'musicUrl')
const musicName = toRef(props, 'musicName')
const wavesurferRef = ref<HTMLElement | null>(null)
onMounted(() => {
  if (wavesurferRef.value) {
    const wavesurfer = WaveSurfer.create({
      container: wavesurferRef.value,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      url: 'https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_kaufman_s_maid.mp3',

      // Set a bar width
      barWidth: 2,
      // Optionally, specify the spacing between bars
      barGap: 1,
      // And the bar radius
      barRadius: 2,
    })
    console.log(wavesurfer);
    
    wavesurfer.once('interaction', () => {
      wavesurfer.play()
    })
  }
})
</script>
<style lang="scss" scoped></style>