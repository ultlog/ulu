<template>
  <el-container>
    <el-header>
    </el-header>
    <el-main>
      <div>
        <el-form :inline="true" :model="query">
          <el-form-item>
<!--            <el-input v-model="query.project" style="width: 100px"  @change="onSubmit" clearable placeholder="项目"></el-input>-->
            <el-select v-model="query.project" filterable clearable style="width: 150px" placeholder="项目" @change="changeProject">
              <el-option
                v-for="item in project"
                style="display:block;"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
<!--            <el-input v-model="query.module" style="width: 100px"  @change="onSubmit" clearable placeholder="模块"></el-input>-->
            <el-select v-model="query.module" filterable clearable style="width: 150px;" placeholder="模块" @change="changeModule">
              <el-option
                style="display:block;"
                v-for="item in module"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
<!--            <el-input v-model="query.uuid" style="width: 150px" @change="onSubmit" clearable placeholder="服务唯一标识"></el-input>-->
            <el-select v-model="query.uuid" filterable clearable style="width: 150px" placeholder="服务唯一标识" @change="onSubmit">
              <el-option
                style="display:block;"
                v-for="item in uuid"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
<!--            <el-input v-model="query.level"  @change="onSubmit" clearable placeholder="日志级别"></el-input>-->
            <el-select v-model="query.level" clearable style="width: 150px;"  placeholder="日志级别" @change="onSubmit">
              <el-option
                style="display:block;"
                v-for="item in level"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
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
        <el-button round style="margin: 20px;" @click="reload">刷新</el-button>
      </div>
    </el-main>
    <el-footer>
      <el-button @click="github" type="primary" icon="el-icon-star-off" circle></el-button>
    </el-footer>
  </el-container>
</template>

<script>
import url from './url'
export default {
  name: 'ult-ui',
  data () {
    return {
      tableData: [],
      tail: false,
      time: [],
      project: [],
      module: [],
      uuid: [],
      level: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
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
      this.$axios.get(url.log, {params: _this.query})
        .then(response => {
          if (response.data.code === 200) {
            response.data.data.data.forEach(item => {
              _this.tableData.push(item)
            })
            _this.query.offset += _this.query.size
            if (_this.query.offset + _this.query.size >= response.data.data.count) {
              _this.tail = true
            }
          } else {
            _this.$message.error('服务器异常')
          }
        })
    },
    changeProject (newValue) {
      this.onSubmit()
      if (newValue === '' || newValue === undefined) {
        this.module = []
        this.query.module = []
        this.changeModule('')
      } else {
        this.getModule()
      }
    },
    changeModule (newValue) {
      this.onSubmit()
      if (newValue === '' || newValue === undefined) {
        this.uuid = []
        this.query.uuid = ''
      } else {
        this.getUuid()
      }
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
      this.$axios.get(url.log, {params: _this.query})
        .then(response => {
          if (response.data.code === 200) {
            _this.tableData = response.data.data.data
            _this.query.offset += _this.query.size
            if (_this.query.offset + _this.query.size >= response.data.data.count) {
              _this.tail = true
            } else {
              _this.tail = false
            }
          } else {
            _this.$message.error('服务器异常')
          }
        })
      this.$axios.get(url.project)
        .then(response => {
          if (response.data.code === 200) {
            _this.project = response.data.data
          } else {
            _this.$message.error('服务器异常')
          }
        })
    },
    getModule () {
      const _this = this
      this.$axios.get(url.module, {params: { project: _this.query.project }})
        .then(response => {
          if (response.data.code === 200) {
            _this.module = response.data.data
          } else {
            _this.$message.error('服务器异常')
          }
        })
    },
    getUuid () {
      const _this = this
      this.$axios.get(url.uuid, {params: {
        project: _this.query.project,
        module: _this.query.module }})
        .then(response => {
          if (response.data.code === 200) {
            _this.uuid = response.data.data
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
