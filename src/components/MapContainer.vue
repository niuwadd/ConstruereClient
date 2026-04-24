<template>
  <div class="size-full">
    <div id="container"></div>
    <div id="panel"></div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, toRefs, watch } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
import { formatTime, formatDistanceAdvanced } from "../utils";
import { onMounted, onUnmounted } from "vue";
import { useI18n } from 'vue-i18n'
import '@amap/amap-jsapi-types';

const { t } = useI18n()
const props = defineProps({
  startPoint: String,
  endPoint: String
});
const emit = defineEmits(["updateDistance", "updateTime"]);
const { startPoint, endPoint } = toRefs(props);
let map: any = null;

// 创建一个函数来执行路线搜索
const searchRoute = () => {
  if (!map || !startPoint?.value || !endPoint?.value) return;

  AMapLoader.load({
    key: "350f66335d53dda3db3a355cbdf97739",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.Driving"]
  }).then((AMap) => {
    // 引入和创建驾车规划插件
    AMap.plugin(['AMap.Driving'], function () {
      const driving = new AMap.Driving({
        map: map,
        panel: '',
      })

      const points = [
        { keyword: startPoint.value, city: '成都' },
        { keyword: endPoint.value, city: '成都' },
      ]

      // 获取起终点规划线路
      driving.search(points, function (status: string, result: any) {
        if (status === 'complete') {
          const route = result.routes[0]
          emit("updateDistance", formatDistanceAdvanced(route.distance, 1, t))
          emit("updateTime", formatTime(route.time, t))
        } else {
          console.log(result);
          console.log('获取驾车数据失败：' + result.info)
        }
      })
    })
  });
};

onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: "4f70a8ce6b5f84616da458495103de40",
  };

  await nextTick();

  AMapLoader.load({
    key: "350f66335d53dda3db3a355cbdf97739",
    version: "2.0",
    plugins: ["AMap.Scale"],
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        zoom: 11,
        center: [104.09, 30.51],
        mapStyle: "amap://styles/dark",
      });
      // 检查样式是否应用成功
      setTimeout(() => {
        if (map) {
          console.log('Current map style:', map.getMapStyle());
        }
      }, 1000);
      // 初始加载时如果有起点和终点则搜索路线
      if (startPoint?.value && endPoint?.value) {
        searchRoute();
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

// 监听 props 变化，重新搜索路线
watch([startPoint, endPoint], ([newStartPoint, newEndPoint]) => {
  if (newStartPoint && newEndPoint) {
    // 清除地图上的覆盖物和路线
    if (map) {
      map.clearMap();
    }
    searchRoute();
  }
});

onUnmounted(() => {
  map?.destroy();
});
</script>
<style scoped lang="scss">
#container {
  width: 100%;
  height: 100%
}

/* #panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}

#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
} */
</style>