<template>
  <div class="tab-container">
    <aside>
      store異步commit測試
    </aside>

    <div class="filter-container draft" style="background: #ffffff;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleSetTXTasync">
        async純文字
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleSetTXT">
        純文字
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleApiAxios">
        handleApiAxios
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleApiAxiosAsync">
        handleApiAxiosAsync
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleApiFetch">
        handleApiFetch
      </el-button>

    </div>
    －－－－－－－－－－
    <p>{{ test01 }}</p>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getList } from '@/api/store'

export default {
  name: 'Store',
  inject: ['reload'],
  // components: {  },
  directives: { waves },
  data() {
    return {
      test01: '空空',
      listALL: null,
      list: null,
      tabMapOptions: [
        { label: '全部', key: 'ALL' },
        { label: '進行中', key: 'DOING' },
        { label: '已完成', key: 'END' }
      ],
      activeName: 'ALL',
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '編輯代辦項目',
        create: '新增代辦項目'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    handleApiFetch() {
      // Promise 的特性，是一個then接一個，要分批處理
      // post帶參數的範例：https://wcc723.github.io/javascript/2017/12/28/javascript-fetch/
      fetch('http://localhost:9527/dev-api/roles')
        .then((response) => {
          // 接收回傳值，改回傳json格式繼續
          return response.json()
        }).then((jsonData) => {
          // 接收改為json格式的回傳值，接著繼續處理
          // console.log('jsonData:' + JSON.stringify(jsonData.data[0].description))
          // this.test01 = ''
          // this.test01 = JSON.stringify(jsonData.data[0].description)

          this.$store.dispatch('testStore/getTXT', { data: JSON.stringify(jsonData.data[1].description) })
          this.getTXT()
        }).catch((err) => {
          console.log('錯誤:', err)
        })
    },
    async handleApiAxiosAsync() {
      await getList().then(response => {
        // this.test01 = ''
        // this.test01 = response.data[0].description
        // console.log('handleApiAxiosAsync:' + this.test01)

        this.$store.dispatch('testStore/getTXT', { data: response.data[2].description })
        this.getTXT()
      }).catch(err => {
        console.log(err)
      })
    },
    handleApiAxios() {
      getList().then(response => {
        // this.test01 = ''
        // this.test01 = response.data[0].description
        // console.log('handleApiAxios:' + this.test01)

        this.$store.dispatch('testStore/getTXT', { data: response.data[0].description })
        this.getTXT()
      }).catch(err => {
        console.log(err)
      })
    },
    handleSetTXT() {
      this.$store.dispatch('testStore/getTXT', { data: 'HAHA' })
      this.getTXT()
    },
    async handleSetTXTasync() {
      await this.$store.dispatch('testStore/getTXT', { data: 'HAHA' })
      await this.getTXT()
    },
    getTXT() {
      this.test01 = this.$store.getters.testTXT
      console.log('this.test01:' + this.test01)
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
