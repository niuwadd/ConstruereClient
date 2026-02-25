<template>
  <div class="size-full flex flex-col p-10">
    <div>
      <div></div>
    </div>
    <div class="h-full flex flex-col gap-8">
      <!-- 堆叠卡片 -->
      <div class="flex gap-8">
        <ul class="flex-1">
          <li class="flex flex-col items-center gap-4 rounded-2xl h-[180px] bg-gray-300 p-4">
            <div class="flex justify-between items-center w-full">
              <h2 class="text-5xl font-bold">29°</h2>
              <div>
                <p class="text-xl font-bold">成都市·双流区</p>
                <p class="text-gray-500">阴转雷阵雨</p>
              </div>
              <img class="w-20" :src="Thunderstorm" alt="">
            </div>
            <div class="flex justify-between items-center w-[80%]">
              <div class="flex flex-col items-center">
                <WindForce class="size-8" />
                <p class="text-gray-500">26km/h</p>
              </div>
              <div class="flex flex-col items-center">
                <Moisture class="size-8" />
                <p class="text-gray-500">83%</p>
              </div>
              <div class="flex flex-col items-center">
                <AirQuality class="size-8" />
                <p class="text-gray-500">32</p>
              </div>
            </div>
          </li>
        </ul>
        <ul class="flex-1">
          <li class="rounded-2xl h-[180px] bg-gray-300">

          </li>
        </ul>
      </div>
      <!-- 大图卡片 -->
      <div class="flex-1">
        <Navigation :location="'3150 Paradise Rd, Las Vegas'" :des="'University Medical center of Southern Nevada'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted, reactive, watch, computed, type Component } from 'vue'
import Navigation from './template/navigation.vue'
import Thunderstorm from '@/assets/image/weather/thunderstorm.png'
import AirQuality from '@/assets/svg/air-quality.svg'
import WindForce from '@/assets/svg/wind-force.svg'
import Moisture from '@/assets/svg/moisture.svg'

</script>
<style lang="scss" scoped></style>
