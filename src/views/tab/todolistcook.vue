<template>
  <div class="tab-container">
    <aside>
      將任務從您的腦海中移到任務清單上來重新找回清晰和寧靜。
      <br>
      採用localStorage進行本地端紀錄
    </aside>

    <div class="filter-container sub-navbar draft" style="background: #ffffff;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        輸出-->
      <!--      </el-button>-->
    </div>

    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <tab-pane v-if="activeName==item.key" :type="item.key" @update="handleUpdate" @end="endData" @list="handleList" @del="handleDelete" />
        <!--        <keep-alive>-->
        <!--          <tab-pane v-if="activeName==item.key" :type="item.key" @update="handleUpdate" @end="endData" @list="handleList" @del="handleDelete" />-->
        <!--        </keep-alive>-->
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 90%; margin-left:50px;">
        <!--        <el-form-item label="Date" prop="timestamp">-->
        <!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        <!--        </el-form-item>-->
        <el-form-item label="事項" prop="title">
          <el-input v-model="temp.title" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
        <!--        <el-form-item label="Status">-->
        <!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
        <!--            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="重要性">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <!--        <el-form-item label="Remark">-->
        <!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          確定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import TabPane from './components/TabPaneCook'

export default {
  name: 'ToDoList',
  inject: ['reload'],
  components: { TabPane },
  directives: { waves },
  data() {
    return {
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (window.localStorage.getItem('todo') !== null) {
            this.listAll = JSON.parse(window.localStorage.getItem('todo')).sort(function(a, b) { return b.id - a.id })
          } else {
            this.listAll = []
          }

          const id = (window.localStorage.getItem('todo') !== null)
            ? this.listAll[0].id + 1
            : parseInt(Math.random() * 100) + 1024

          this.listAll.push({
            'id': id,
            'title': this.temp.title,
            'importance': this.temp.importance,
            'author': 'vue-element-admin',
            'type': 'DOING',
            'remark': '',
            'timestamp': new Date(),
            'status': 'published'
          })
          window.localStorage.setItem('todo', JSON.stringify(this.listAll))

          // 排序列表
          if (window.localStorage.getItem('todo') !== null) {
            this.listAll.sort(function(a, b) { return b.id - a.id }) // b - a > 0
          }

          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '新增完成',
            type: 'success',
            duration: 2000
          })

          this.reload()
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

          this.listAll = JSON.parse(window.localStorage.getItem('todo'))
          const idx = this.listAll.findIndex(v => v.id === this.temp.id)
          const isHave = (idx >= 0)

          if (isHave) {
            /** 存在就替換 */
            this.listAll.splice(idx, 1, {
              'id': this.temp.id,
              'title': this.temp.title,
              'importance': this.temp.importance,
              'author': 'vue-element-admin',
              'type': 'DOING',
              'remark': '',
              'timestamp': new Date(),
              'status': 'published'
            })
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新完成',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: 'Success',
              message: '更新失敗',
              type: 'success',
              duration: 2000
            })
          }

          window.localStorage.setItem('todo', JSON.stringify(this.listAll))

          this.reload()
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleList(list) {
      this.list = list
    },
    endData(row) {
      this.listAll = JSON.parse(window.localStorage.getItem('todo'))
      const idx = this.listAll.findIndex(v => v.id === row.id)
      const isHave = (idx >= 0)

      if (isHave) {
        /** 存在就替換 */
        this.listAll.splice(idx, 1, {
          'id': row.id,
          'title': row.title,
          'importance': row.importance,
          'author': 'vue-element-admin',
          'type': 'END',
          'remark': '',
          'timestamp': new Date(),
          'status': 'published'
        })
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '更新完成',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$notify({
          title: 'Success',
          message: '更新失敗',
          type: 'success',
          duration: 2000
        })
      }
      window.localStorage.setItem('todo', JSON.stringify(this.listAll))

      this.reload()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index, id) {
      this.listAll = JSON.parse(window.localStorage.getItem('todo'))
      const idx = this.listAll.findIndex(v => v.id === id)

      this.$notify({
        title: 'Success',
        message: '刪除完畢',
        type: 'success',
        duration: 2000
      })
      this.listAll.splice(idx, 1)

      window.localStorage.setItem('todo', JSON.stringify(this.listAll))

      this.reload()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
