<template>
  <div class="">
    <!-- <div class="w-[100px] ">
      <div class="flex justify-center items-center bg-white/20 rounded-2xl">
        <Pause class="size-[80px] fill-white" />
      </div>
    </div> -->
    <!-- <div class="flex-1">
      <div class="flex justify-between ">
        <div>
          <h3 class="text-2xl">夜曲</h3>
          <p class="text-gray-300">周杰伦</p>
        </div>
        <img class="h-[100px]" :src="Music" alt="">
      </div>
      <div ref="wavesurferRef"></div>
    </div> -->
    <div>
      <img :class="isAudioPlay ? 'animate-spin' : ''" :src="Record" alt=""></img>
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <h3 class="text-2xl">{{ musicName }}</h3>
        <p class="text-gray-300">{{ musicSinger }}</p>
      </div>
      <audio ref="audioPlayRef" class="w-full" :src="musicUrl" controls autoplay></audio>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import WaveSurfer from 'wavesurfer.js'
// import Play from '@/assets/svg/play.svg'
import Record from '@/assets/image/record.png'
// import Music from '@/assets/image/music.png'
const { musicUrl, musicName, musicSinger } = defineProps<{ musicUrl: string, musicName: string, musicSinger: string }>()
const wavesurferRef = ref<HTMLElement | null>(null)
const audioPlayRef = ref<HTMLAudioElement | null>(null)
const isAudioPlay = ref(false)
onMounted(() => {
  if (wavesurferRef.value) {
    console.log(wavesurferRef.value);

    const wavesurfer = WaveSurfer.create({
      container: wavesurferRef.value,
      waveColor: 'rgb(255, 255, 255)',
      progressColor: '#6886fc',
      url: 'https://dn720307.ca.archive.org/0/items/pkmn-xy-soundtrack/Disc%201%2F02%20-%20Opening%20Movie.mp3',

      // Set a bar width
      barWidth: 2,
      // Optionally, specify the spacing between bars
      barGap: 2,
      // And the bar radius
      barRadius: 2,
      height: 40,
    })
    console.log(wavesurfer);

    wavesurfer.once('interaction', () => {
      wavesurfer.play()
    })
  }
  if (audioPlayRef.value) {
    // 监听是否在播放音乐
    audioPlayRef.value.addEventListener('play', () => {
      isAudioPlay.value = true
    })
    // 监听是否暂停音乐
    audioPlayRef.value.addEventListener('pause', () => {
      isAudioPlay.value = false
    })
  }
})
</script>
<style lang="scss" scoped></style>