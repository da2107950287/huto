import axios from 'axios'
import qs from 'qs'
export function http(url, data = {}, method = 'post') {
  return new Promise((resolve, reject) => {
    let instance = axios.create({
      baseURL: '/room'
    })
    let option = {}
    if (method == 'post') {
      option = {
        url,
        method,
        data: qs.stringify(data)
      }
    } else {
      option = {
        url,
        method,
        params: data
      }
    }
    instance.interceptors.response.use(res => {
      if (res.status == 200) {
        return res.data
      } else {

      }
    })
    instance(option).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })

  })
}