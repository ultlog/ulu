<template>
  <el-container>
    <el-header>
    </el-header>
    <el-main>
      <div>
        <el-form :inline="true" :model="query">
          <el-form-item>
            <el-input v-model="query.project" style="width: 100px"  @change="onSubmit" clearable placeholder="项目"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.module" style="width: 100px"  @change="onSubmit" clearable placeholder="模块"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.uuid" style="width: 150px" @change="onSubmit" clearable placeholder="服务唯一标识"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.level"  @change="onSubmit" clearable placeholder="日志级别"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.message" @change="onSubmit" clearable placeholder="日志信息"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.stack"  @change="onSubmit" clearable placeholder="堆栈信息"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="-"
              @change="changeTime"
              start-placeholder="起始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <!--        <el-form-item>-->
          <!--          <el-button type="primary" @click="onSubmit">query</el-button>-->
          <!--        </el-form-item>-->
        </el-form>

        <el-table
          :data="tableData"
          border
          :row-style="{height:'20px'}">
          <el-table-column
            prop="project"
            label="项目"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="module"
            label="模块"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="uuid"
            align="center"
            label="服务唯一标识"
            width="200">
          </el-table-column>
          <el-table-column
            prop="level"
            align="center"
            label="日志级别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="message"
            align="center"
            label="日志信息">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div v-html="alertMessage(scope.row.message)" slot="content"></div>
                <div v-if="scope.row.message.length>70">{{scope.row.message.substring(0,70)+'...'}}</div>
                <div v-else>{{scope.row.message}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="stack"
            align="center"
            label="堆栈信息">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="left" v-if="scope.row.stack!==null">
                <div v-html="alertStack(scope.row.stack)" slot="content"></div>
                <div>{{scope.row.stack.substring(0,60)+'...'}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="产生时间"
            width="200"
            :formatter="formatter">
          </el-table-column>
        </el-table>

        <el-button round style="margin: 20px;" @click="loadMore" v-if="!tail">加载更多</el-button>
        <el-button round style="margin: 20px;" @click="reload" v-if="!tail">刷新</el-button>
      </div>
    </el-main>
    <el-footer>
      <el-button @click="github" type="primary" icon="el-icon-star-off" circle></el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'ult-ui',
  data () {
    return {
      tableData: [],
      tail: false,
      time: [],
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
    reload () {
      this.onSubmit()
    },
    loadMore () {
      const _this = this
      this.$axios.get('/api/v1/log', {params: _this.query})
        .then(response => {
          if (response.data.code === 200) {
            response.data.data.data.forEach(item => {
              _this.tableData.push(item)
            })
            _this.query.offset += _this.query.size
            console.log(_this.tableData)
            if (_this.query.offset + _this.query.size >= response.data.data.count) {
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
    alertMessage (message) {
      return "<div style='font-size: 15px;width: 500px;'>" + message + '</div>'
    },
    alertStack (stack) {
      return "<div style='font-size: 15px;height:600px;overflow-y:auto'>" + stack.split(';').join('<br />') + '</div>'
    },
    changeTime () {
      const _this = this
      let g = _this.time
      if (g === null) {
        _this.query.gt = ''
        _this.query.lt = ''
      } else {
        _this.query.gt = g[0].getTime()
        _this.query.lt = g[1].getTime()
      }
      this.onSubmit()
    },
    github () {
      window.open('https://github.com/ultlog/ulu', '_blank')
    },

    getData () {
      const _this = this
      this.$axios.get('/api/v1/log', {params: _this.query})
        .then(response => {
          if (response.data.code === 200) {
            _this.tableData = response.data.data.data
            _this.query.offset += _this.query.size
            console.log(_this.tableData)
            if (_this.query.offset + _this.query.size >= response.data.data.count) {
              _this.tail = true
            }
          } else {
            _this.$message.error('服务器异常')
          }
        })
    },
    formatter (row, column) {
      const date = new Date(row.createTime)
      const dateNumFun = (num) => num < 10 ? `0${num}` : num
      const [Y, M, D, h, m, s] = [
        date.getFullYear(),
        dateNumFun(date.getMonth() + 1),
        dateNumFun(date.getDate()),
        dateNumFun(date.getHours()),
        dateNumFun(date.getMinutes()),
        dateNumFun(date.getSeconds())
      ]
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main{
    padding-left: 100px;
    padding-right: 100px;
  }
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
