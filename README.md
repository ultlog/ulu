# ulu

### 安装ultlog-ui

#### 下载
点击[此处](https://github.com/ultlog/ulu/releases)下载ulu.zip

``如果部署在windows系统，可以选择下载ulu-nginx.zip，其自带一个免安装版本的nginx。``

#### 安装
将下载的文件解压到nginx的html路径下，目录结构为
``{base_path}/nginx/html/index.html`` 和 ``{base_path}/nginx/html/static``

修改nginx配置文件中的反向代理配置，添加如下代码
````
location ^~ /api {
    proxy_pass http://{ula-host}:{ula-ip};
}
````
将其中ula-ip/port替换为[ula](https://github.com/ultlog/ula/blob/master/README.md)部署的地址和端口

#### 启动nginx
````shell script
start nginx
````
