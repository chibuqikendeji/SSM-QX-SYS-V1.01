//设置全局表单提交格式
Vue.http.options.emulateJSON = true;

const {body} = document;
const WIDTH = 1024;
const RATIO = 3;

const api = {
    findByPage(flag, pageSize, pageCode) {
        return flag + '/findByPage.do?pageSize=' + pageSize + '&pageCode=' + pageCode
    },
    delete(flag) {
        return flag + '/delete.do';
    },
    update(flag) {
        return flag + '/update.do'
    },
    save(flag) {
        return flag + '/save.do'
    },
    findById(flag, id) {
        return flag + '/findById.do?id=' + id
    },
    info: 'admin/info.do'
};

// Vue实例
var vm = new Vue({
    el: '#app',
    data() {
        return {
            //实体类
            entity: {
                category: [{
                    id: '',
                    name: ''
                }],
                tags: [{
                    id: '',
                    name: ''
                }],
            },
            editor: {
                id: '',
                name: '',
            },

            //分页选项
            pageConf: {
                //设置一些初始值(会被覆盖)
                pageCode: 1, //当前页
                pageSize: 6, //每页显示的记录数
                totalPage: 12, //总记录数
                pageOption: [6, 10, 20], //分页选项

                t_pageCode: 1,
                t_pageSize: 6,
                t_totalPage: 12,
                t_pageOption: [6, 10, 20]
            },

            dialogVisible: false,
            dialogFlag: '',
            dialogType: true, //dialog分类：true：新增，false：修改
            defaultActive: '5',
            token: {name: ''},

            mobileStatus: false, //是否是移动端
            sidebarStatus: true, //侧边栏状态，true：打开，false：关闭
            sidebarFlag: ' openSidebar ', //侧边栏标志
        }
    },
    methods: {
        //打开侧边栏
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            this.dialogVisible = false;
        },

        //刷新列表
        reloadList(flag) {
            this.search(flag, this.pageConf.pageCode, this.pageConf.pageSize);
        },
        //条件查询
        search(flag, pageCode, pageSize) {
            this.$http.post(api.findByPage(flag, pageSize, pageCode)).then(result => {
                if (flag == 'category') {
                    this.entity.category = result.body.data.rows;
                    this.pageConf.totalPage = result.body.data.total;
                }
                if (flag == 'tags') {
                    this.entity.tags = result.body.data.rows;
                    this.pageConf.t_totalPage = result.body.data.total;
                }
            });
        },

        //pageSize改变时触发的函数
        handleSizeChange(val) {
            this.search('category', this.pageConf.pageCode, val);
        },
        t_handleSizeChange(val) {
            this.search('tags', this.pageConf.t_pageCode, val);
        },
        //当前页改变时触发的函数
        handleCurrentChange(val) {
            this.pageConf.pageCode = val;
            this.search('category', val, this.pageConf.pageSize);
        },
        t_handleCurrentChange(val) {
            this.pageConf.t_pageCode = val;
            this.search('tags', val, this.pageConf.t_pageSize);
        },

        //删除
        sureDelete(flag, ids) {
            this.$confirm('你确定永久删除此用户信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$http.post(api.delete(flag), JSON.stringify(ids)).then(result => {
                    if (result.body.code == 20000) {
                        //删除成功
                        this.$message({
                            type: 'success',
                            message: result.body.data,
                            duration: 6000
                        });
                        if (flag == 'category') {
                            if ((this.pageConf.totalPage - 1) / this.pageConf.pageSize === (this.pageConf.pageCode - 1)) {
                                this.pageConf.pageCode = this.pageConf.pageCode - 1;
                            }
                        }
                        if (flag == 'tags') {
                            if ((this.pageConf.t_totalPage - 1) / this.pageConf.t_pageSize === (this.pageConf.t_pageCode - 1)) {
                                this.pageConf.t_pageCode = this.pageConf.t_pageCode - 1;
                            }
                        }
                        this.reloadList(flag);
                    } else {
                        //删除失败
                        this.$message({
                            type: 'warning',
                            message: result.body.data,
                            duration: 6000
                        });
                        this.reloadList(flag);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 6000
                });
            });
        },
        //删除按钮
        handleDelete(flag, id) {
            var ids = new Array();
            ids.push(id);
            this.sureDelete(flag, ids);
        },
        //新增按钮
        handleSave(flag) {
            this.editor = {};
            this.dialogVisible = true;
            if (flag == 'category') {
                this.dialogFlag = '分类'
            }
            if (flag == 'tags') {
                this.dialogFlag = '标签'
            }
            this.dialogType = true;
        },
        //更新按钮
        handleEdit(flag, id) {
            this.dialogVisible = true;
            //查询当前id对应的数据
            this.$http.get(api.findById(flag, id)).then(result => {
                this.editor = result.body.data;
            });
            this.dialogType = false; //更新
            if (flag == 'category') {
                this.dialogFlag = '分类'
            }
            if (flag == 'tags') {
                this.dialogFlag = '标签'
            }
        },
        handleGo() { //新增、更新公用
            this.dialogVisible = false;
            if (this.editor.name == null || this.editor.name == '') {
                this.$message({
                    type: 'error',
                    message: '输入的信息不能为空',
                    duration: 6000
                });
                return false;
            }
            var flag = '';
            if (this.dialogType) {
                //新增
                if (this.dialogFlag == '分类') {
                    flag = api.save('category')
                }
                if (this.dialogFlag == '标签') {
                    flag = api.save('tags')
                }
                console.log('请求API：' + flag + ', 数据：' + this.editor.name);
                this.$http.post(flag, JSON.stringify(this.editor)).then(result => {
                    if (result.body.code == 20000) {
                        this.$message({
                            type: 'success',
                            message: result.body.data,
                            duration: 6000
                        });
                    } else {
                        this.$message({
                            type: 'danger',
                            message: result.body.data,
                            duration: 6000
                        });
                    }
                    this.reloadList(flag.substring(1, flag.lastIndexOf('/')));
                });
            } else {
                //更新
                if (this.dialogFlag == '分类') {
                    flag = api.update('category')
                }
                if (this.dialogFlag == '标签') {
                    flag = api.update('tags')
                }
                console.log('请求API：' + flag + ', 数据：' + this.editor.name);
                this.$http.put(flag, JSON.stringify(this.editor)).then(result => {
                    if (result.body.code == 20000) {
                        this.$message({
                            type: 'success',
                            message: result.body.data,
                            duration: 6000
                        });
                    } else {
                        this.$message({
                            type: 'danger',
                            message: result.body.data,
                            duration: 6000
                        });
                    }
                    this.reloadList(flag.substring(1, flag.lastIndexOf('/')));
                });
            }

        },

        init() {
            //已登录用户名
            this.$http.get(api.info).then(result => {
                this.token.name = result.body.data.name;
            });
        },

        isMobile() {
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH
        },

        handleSidebar() {
            if (this.sidebarStatus) {
                this.sidebarFlag = ' hideSidebar ';
                this.sidebarStatus = false;

            } else {
                this.sidebarFlag = ' openSidebar ';
                this.sidebarStatus = true;
            }
            const isMobile = this.isMobile();
            if (isMobile) {
                this.sidebarFlag += ' mobile ';
                this.mobileStatus = true;
            }
        },
        //蒙版
        drawerClick() {
            this.sidebarStatus = false;
            this.sidebarFlag = ' hideSidebar mobile '
        }

    },
    // 生命周期函数
    created() {
        this.search('category', this.pageConf.pageCode, this.pageConf.pageSize);
        this.search('tags', this.pageConf.t_pageCode, this.pageConf.t_pageSize);
        this.init();

        const isMobile = this.isMobile();
        if (isMobile) {
            //手机访问
            this.sidebarFlag = ' hideSidebar mobile ';
            this.sidebarStatus = false;
            this.mobileStatus = true;
        }

    },
});
