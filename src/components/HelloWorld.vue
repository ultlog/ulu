<template>
  <div>

    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="query.project" clearable placeholder="project"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.module" clearable placeholder="module"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.uuid" clearable placeholder="uuid"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.level" clearable placeholder="level"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.message" clearable placeholder="message"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.stack" clearable placeholder="stack"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">query</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      :row-style="{height:'20px'}"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
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

        prop="stack"
        label="堆栈信息">

        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="left">
            <div v-html="alertStack(scope.row.stack)" slot="content"></div>
            <div>{{scope.row.stack.substring(0,40)+'...'}}</div>
          </el-tooltip>
        </template>

      </el-table-column>
    </el-table>

    <el-button round style="margin: 20px;" @click="loadMore" v-if="!tail && tableData.length>0">load more</el-button>
  </div>
</template>

<script>
export default {
  name: 'ult-ui',
  data () {
    return {
      tableData: [],
      tail: false,
      query: {
        offset: 0,
        size: 10,
        project: '',
        module: '',
        uuid: '',
        level: '',
        message: ''
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    loadMore () {
      const _this = this
      this.$axios.get('http://localhost:8080/api/v1/log', {params: _this.query})
        .then(response => {
          if (response.data.code === 200) {
            response.data.data.data.forEach(item => {
              _this.tableData.push(item)
            })
            _this.offset += _this.size
            console.log(_this.tableData)
            if (_this.offset * _this.size >= response.data.count) {
              _this.tail = true
            }
          } else {
            _this.$message.error('服务器异常')
          }
        })
    },
    onSubmit () {
      this.query.offset = 0
      this.getData()
    },

    alertStack (stack) {
      return stack.split(';').join('<br />')
    },

    getData () {
      const _this = this
      this.$axios.get('http://localhost:8080/api/v1/log', {params: _this.query})
        .then(response => {
          if (response.data.code === 200) {
            _this.tableData = response.data.data.data
            _this.offset += _this.pageSize
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
