<h1 align="center">ultlog-ui</h1>
<p align="center">
  <a href="https://travis-ci.com/github/ultlog/ulu"><img src="https://travis-ci.com/ultlog/ulu.svg?branch=master"></a>
  <a href="https://github.com/ultlog/ulu/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue"></a>
  <a href="https://github.com/ultlog/ulu/pulls"><img src=https://img.shields.io/badge/pr-welcome-green"></a>
  <a href="https://github.com/ultlog/ulu/releases/"><img src="https://img.shields.io/github/v/release/ultlog/ulu"></a>
  <a href="https://github.com/ultlog/ulu/pulls?q=is%3Apr+is%3Aclosed"><img src="https://img.shields.io/github/issues-pr-closed/ultlog/ulu"></a>
</p>
<p align="center">
The abbreviation of ultlog-ui is ulu, which is a web program that displays logs in the ultlog system.
</p>

## Install

#### Download
Click [here](https://github.com/ultlog/ulu/releases) to download.

``If install on a windows, you can choose to download ulu-nginx, which comes with a free installation version of nginx.``

#### Install
Unzip the downloaded file to the html path of nginx.The directory structure is
````
     nginx
        | —— html
              | —— index.html
              | —— static/
````

Modify the nginx configuration file (normal nginx.conf), add the following code
````
location ^~ /api {
    proxy_pass http://{ula-host}:{ula-ip};
}
````
Replace ula-host/port with the address(or ip) and port of the ula service deployment.

#### Start nginx
````shell script
start nginx
````

## More
[ultlog中文文档](https://ultlog.com/2020/07/26/%E7%B3%BB%E7%BB%9F%E8%AF%B4%E6%98%8E/ulu/ulu/)
