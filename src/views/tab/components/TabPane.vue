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
        <span style="margin-right: 10px">{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="重要性">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" />
      </template>
    </el-table-column>

    <!--    <el-table-column class-name="status-col" label="狀態" width="110">-->
    <!--      <template slot-scope="{row}">-->
    <!--        <el-tag :type="row.status | statusFilter">-->
    <!--          {{ row.status }}-->
    <!--        </el-tag>-->
    <!--      </template>-->
    <!--    </el-table-column>-->

    <el-table-column v-if="type !== 'END'" label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="{row,$index}">
        <el-button v-if="row.type !== 'END'" type="primary" size="mini" @click="handleUpdate(row)">
          編輯
        </el-button>

        <el-button v-if="row.type !== 'END'" size="mini" type="danger" @click="handleDelete(row,$index)">
          刪除
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
        limit: 500,
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
    handleDelete(row, index) {
      this.$emit('del', row, index)
    },
    handleUpdate(row) {
      this.$emit('update', row)
    },
    getList() {
      this.loading = true
      this.$emit('create')
      this.listQuery.type = (this.listQuery.type === 'ALL') ? '' : this.listQuery.type

      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.loading = false

        this.$emit('list', response.data.items)
      })
    }
  }
}
</script>

