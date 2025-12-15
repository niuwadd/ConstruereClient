<template>
  <div class="size-full">
    <div id="container"></div>
    <div id="panel"></div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
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
declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode?: string };
  }
}

let map: any = null;
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "4f70a8ce6b5f84616da458495103de40",
  };
  AMapLoader.load({
    key: "	350f66335d53dda3db3a355cbdf97739", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
      const points = [
        { keyword: startPoint?.value, city: '成都' }, //起始点坐标
        { keyword: endPoint?.value, city: '成都' }, //终点坐标
      ]
      //引入和创建驾车规划插件
      AMap.plugin(['AMap.Driving'], function () {
        const driving = new AMap.Driving({
          map: map,
          panel: '', //参数值为你页面定义容器的 id 值<div id="my-panel"></div>
        })

        //获取起终点规划线路
        driving.search(points, function (status: string, result: any) {
          if (status === 'complete') {
            //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
            //查询成功时，result 即为对应的驾车导航信息
            console.log(result)
            const route = result.routes[0]
            emit("updateDistance", formatDistanceAdvanced(route.distance, 1, t))
            emit("updateTime", formatTime(route.time, t))
          } else {
            console.log('获取驾车数据失败：' + result)
          }
        })
      })

      /* AMap.plugin(['AMap.Geolocation'], function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          position: 'RB',    //定位按钮的停靠位置
          offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status: unknown, result: unknown) {
          console.log('定位状态:', status);
          console.log('定位结果:', result);
        });
      }); */
    })
    .catch((e) => {
      console.log(e);
    });
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