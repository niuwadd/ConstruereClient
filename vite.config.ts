import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
// import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss(), svgLoader()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/stream/v1': {
        target: 'https://nls-gateway-cn-shanghai.aliyuncs.com',
        changeOrigin: true,
      },
      '/thrift': {
        target: 'http://10.31.13.177:52002',
        changeOrigin: true,
      },
    },
  },
  assetsInclude: ['**/*.fbx'],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  /* build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  }, */
})
