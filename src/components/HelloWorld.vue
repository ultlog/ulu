<template>
  <div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="project"
      label="项目"
      width="180">
    </el-table-column>
    <el-table-column
      prop="module"
      label="模块"
      width="180">
    </el-table-column>
    <el-table-column
      prop="uuid"
      label="服务唯一标识">
    </el-table-column>
    <el-table-column
      prop="level"
      label="日志级别">
    </el-table-column>
    <el-table-column
      prop="message"
      label="日志信息">
    </el-table-column>
    <el-table-column
      prop="uuid"
      label="堆栈信息">
    </el-table-column>
  </el-table>

  <el-button style="margin: 20px;" v-if="!tail">load more</el-button>
</div>
</template>

<script>
export default {
  name: 'ult-ui',
  data () {
    return {
      tableData: [],
      offset: 0,
      pageSize: 10,
      tail: false
    }
  },
  created () {
    this.getData()
  },
  methods: {

    getData () {
      const _this = this
      this.$axios.get('http://localhost:8080/api/v1/log', {params: {'size': _this.pageSize, 'offset': _this.offset}})
        .then(response => {
          if (response.data.code === 200) {
            _this.tableData = response.data.data.data
            _this.offset += _this.size
            console.log(_this.tableData)
            if (_this.offset * _this.size >= response.data.count) {
              _this.tail = true
            }
          } else {
            _this.$message.error('服务器异常')
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
