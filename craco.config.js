// module.exports = {
//   devServer: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3001",
//         changeOrigin: true,
//         pathRewrite: {
//           "^/api": "", // 可选，如果后端接口的路径不包含 '/api'，则可以去除
//         },
//       },
//     },
//   },
// };

module.exports = {
  devServer: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
};
