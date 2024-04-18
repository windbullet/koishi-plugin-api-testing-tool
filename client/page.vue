<template>
  <k-layout>
    <div class="text-center">
      <div class="join">
          <input v-model="url" class="input input-bordered w-100 join-item"/>
          <select v-model="method" class="select select-bordered join-item" @change="setContentType">
            <option>GET</option>
            <option>POST</option>
            <option>DELETE</option>
            <option>HEAD</option>
            <option>OPTIONS</option>
            <option>PUT</option>
            <option>PATCH</option>
          </select>
          <button type="button" @click="http" class="btn join-item" :disabled="loading">
            <span :class="{'loading loading-spinner loading-md': loading}">{{ loading ? '' : "请求" }}</span>
          </button>
      </div>
      <button v-if="loading" type="button" @click="abort" class="btn btn-error">取消请求</button>
      <div v-show="errorMessage" role="alert" class="alert alert-error w-80 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ errorMessage }}</span>
      </div>
      <div role="tablist" class="flex justify-center items-center h-full w-full tabs tabs-bordered w-30%">
        <a role="tab" class="tab" @click="tap('1')" v-bind:class="{'tab-active': active === '1'}">Query</a>
        <a role="tab" class="tab" @click="tap('2')" v-bind:class="{'tab-active': active === '2'}">Body</a>
        <a role="tab" class="tab" @click="tap('3')" v-bind:class="{'tab-active': active === '3'}">Headers</a>
      </div>
      <div v-if="['POST', 'PUT', 'PATCH'].includes(method)" @change="setContentType">
        <div class="inline pr-3">
          <input type="radio" value="application/x-www-form-urlencoded" v-model="contentType" name="radio-1" id="url" class="radio" checked />
          <label for="url">urlencoded</label>
        </div>
        <div class="inline pr-3">
          <input type="radio" value="application/json" v-model="contentType" name="radio-1" id="json" class="radio" />
          <label for="json">json</label>
        </div>
      </div>
      <div v-show="active === '1'">
        <div class="w-200 mx-auto h-full">
          <table class="table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>参数值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in queryRows" :key="index">
                <td>
                  <input class="input input-bordered" v-model="row.name" />
                </td>
                <td>
                  <input class="input input-bordered w-100" v-model="row.value" />
                </td>
                <td>
                  <button type="button" @click="queryRows.splice(index, 1)" class="btn btn-error w-20">删除</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right">
                  <button type="button" @click="addQueryRow" class="btn">添加一项</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div v-show="active === '2'">
        <div class="w-200 mx-auto h-full">
          <table class="table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>参数值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in bodyRows" :key="index">
                <td>
                  <input class="input input-bordered" v-model="row.name" />
                </td>
                <td>
                  <input class="input input-bordered w-100" v-model="row.value" />
                </td>
                <td>
                  <button type="button" @click="bodyRows.splice(index, 1)" class="btn btn-error w-20">删除</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right">
                  <button type="button" @click="addBodyRow" class="btn">添加一项</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div v-show="active === '3'">
        <div class="w-200 mx-auto h-full">
          <table class="table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>参数值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in headersRows" :key="index">
                <td>
                  <input class="input input-bordered" v-model="row.name" />
                </td>
                <td>
                  <input class="input input-bordered w-100" v-model="row.value" />
                </td>
                <td>
                  <button type="button" @click="headersRows.splice(index, 1)" class="btn btn-error w-20">删除</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right">
                  <button type="button" @click="addHeaderRow" class="btn">添加一项</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    <div v-if="resType === '1'" class="flex flex-col items-center">
      <label class="form-control">
        <div role="tablist" class="tabs tabs-lifted">
          <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="返回值" :checked="def === '1'"/>
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <textarea v-model="result" rows="10" cols="55" readonly class="textarea textarea-bordered"></textarea>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="响应头" :checked="def === '2'"/>
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <textarea v-model="resHeaders" rows="10" cols="55" readonly class="textarea textarea-bordered"></textarea>
          </div>
        </div>
        <div class="label">
          <span class="label-text-alt" v-show="time">耗时 {{ time }} 秒</span>
        </div>
      </label>      
    </div>     
    <div v-if="resType !== '1'" class="flex flex-col items-center">
      <label class="form-control">
        <div role="tablist" class="tabs tabs-lifted">
          <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="返回值" checked/>
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <img v-if="resType === '2'" :src="result" alt="返回内容" width="440">
              <video v-if="resType === '3'" :src="result" controls width="440"></video>
              <audio v-if="resType === '4'" :src="result" controls class=""></audio>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="响应头" />
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <textarea v-model="resHeaders" rows="10" cols="55" readonly class="textarea textarea-bordered"></textarea>
          </div>
        </div>
        <div class="label">
          <span class="label-text-alt" v-show="time">耗时 {{ time }} 秒</span>
        </div>
      </label>

    </div>
    <h1>{{ debug }}</h1>
  </k-layout>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import axios from 'axios'
  let debug = ref("111")
  let url = ref('http://')
  let result = ref('')
  let method = ref('GET')
  let active = ref('1')
  let queryRows = ref([{name: '', value: ''}])
  let bodyRows = ref([{name: '', value: ''}])
  let headersRows = ref([{name: '', value: ''}])
  let urlWithQuery = ref()
  let resType = ref('1')
  let errorMessage = ref('')
  let loading = ref(false)
  let time = ref(0)
  let resHeaders = ref('')
  let def = ref('1')
  let contentType = ref('application/x-www-form-urlencoded')
  let controller
  let aborted = false


  function http() {
    loading.value = true
    try{
      urlWithQuery.value = new URL(url.value)
    } catch(err) {
      loading.value = false
      errorMessage.value = 'URL不合法'
      return
    }

    for (let param of queryRows.value) {
      if (param.name && param.value) {
        urlWithQuery.value.searchParams.append(param.name, param.value)
      }
    }

    let headers = {}
    for (let header of headersRows.value) {
      if (header.name && header.value) {
        headers[header.name] = header.value
      }
    }

    aborted = false
    controller = new AbortController()
    let start = new Date().getMilliseconds()

    let config = {
      url: urlWithQuery.value, 
      method: method.value, 
      headers, 
      signal: controller.signal, 
      responseType: 'blob'
    } as const

    if (method.value === 'POST') {
      let data = {}
      for (let body of bodyRows.value) {
        if (body.name && body.value) {
          data[body.name] = body.value
        }
      }
      config["data"] = data
    }
    

    axios(config)
      .then(async response => {
        let end = new Date().getMilliseconds()
        time.value = (end - start) / 1000
        loading.value = false
        resHeaders.value = JSON.stringify(response.headers, null, 2)
        if (response.data.size === 0) {
          resType.value = '1'
          result.value = ''
        } else if (response.data.type.startsWith('image')) {
          resType.value = '2'
          result.value = result.value = URL.createObjectURL(response.data)
        } else if (response.data.type.startsWith('video')) {
          resType.value = '3'
          result.value = result.value = URL.createObjectURL(response.data)
        } else if (response.data.type.startsWith('audio')) {
          resType.value = '4'
          result.value = result.value = URL.createObjectURL(response.data)
        } else {
          if (response.data.type === 'application/json') {
            resType.value = '1'
            result.value = JSON.stringify(JSON.parse(await response.data.text()), null, 2)
          } else {
            resType.value = '1'
            result.value = await response.data.text()
          }
        }
      })
      .catch(error => {
        loading.value = false
        if (!aborted) {
          errorMessage.value = "请求失败，请按f12进入开发者工具查看详细错误信息\n" + error
        }
      })
  }

  function abort() {
    aborted = true
    controller.abort()
    loading.value = false
  }
    
  function tap(index: string) {
    active.value = index
  }
  function addQueryRow() {
    queryRows.value.push({name: '', value: ''})
  }
  function addBodyRow() {
    bodyRows.value.push({name: '', value: ''})
  }
  function addHeaderRow() {
    headersRows.value.push({name: '', value: ''})
  }
  function setContentType() {
    if (['POST', 'PUT', 'PATCH'].includes(method.value)) { 
      let index = headersRows.value.findIndex(header => header.name.toLowerCase() === 'content-type')
      if (index < 0) {
        headersRows.value.unshift({name: 'content-type', value: contentType.value})
      } else {
        headersRows.value[index].value = contentType.value
      }
    } else {
      let index = headersRows.value.findIndex(header => header.name.toLowerCase() === 'content-type')
      if (index >= 0) {
        headersRows.value.splice(index, 1)
      }
    }
  }
</script>