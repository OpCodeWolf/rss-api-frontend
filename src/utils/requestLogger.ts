import axios from 'axios';
import config from '../config.json'; // Importing configuration

// Create an instance of axios
const axiosInstance = axios.create();

// TODO: TBD Setup metrics logging, if needed
// let internal: boolean = false;
// Function to log requests to the server
// const logRequestToServer = async (requestDetails: any): Promise<boolean> => {
//   const token = localStorage.getItem('token');
//   return await axiosInstance.post(`${config.backendAPIBaseUrl}/frontend-logs`, {
//     requestDetails,
//   }, {
//     headers: {
//       Authorization: token, // Send the token without "Bearer" prefix
//     }
//   });
// };

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//   async (data) => {
//     // if (internal) return;
//     // Log request details to the server
//     // internal = true;
//     // if (data) {
//       // console.log(JSON.stringify({
//       //   data: data,
//       // }, null, 2));
//       // await logRequestToServer({
//       //   data: config.data,
//       // });
//     // // }
//     // // internal = false;
//     return Promise.resolve();
//   },
//   (error) => {
//     console.error('Error in request: ', error);
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
