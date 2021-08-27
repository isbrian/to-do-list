<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="時間">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="事項">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <!--    <el-table-column width="110px" align="center" label="Author">-->
    <!--      <template slot-scope="scope">-->
    <!--        <span>{{ scope.row.author }}</span>-->
    <!--      </template>-->
    <!--    </el-table-column>-->

    <el-table-column width="120px" label="重要性">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" />
      </template>
    </el-table-column>

    <!--    <el-table-column align="center" label="Readings" width="95">-->
    <!--      <template slot-scope="scope">-->
    <!--        <span>{{ scope.row.pageviews }}</span>-->
    <!--      </template>-->
    <!--    </el-table-column>-->

    <el-table-column class-name="status-col" label="狀態" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="{row,$index}">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">
          Edit
        </el-button>
        <!--        <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">-->
        <!--          Publish-->
        <!--        </el-button>-->
        <!--        <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">-->
        <!--          Draft-->
        <!--        </el-button>-->
        <el-button v-if="row.status!='published'" size="mini" type="danger" @click="handleDelete(row,$index)">
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/todolist'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5000,
        type: this.type,
        sort: '-id'
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleUpdate(row) {
      this.$emit('update', row) // for test

      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    getList() {
      this.loading = true
      this.$emit('create') // for test

      // console.log('eee:' + JSON.stringify(this.listQuery))

      this.listQuery.type = (this.listQuery.type === 'ALL') ? '' : this.listQuery.type

      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.loading = false

        this.$emit('list', response.data.items) // for test
      })
    }
  }
}
</script>

