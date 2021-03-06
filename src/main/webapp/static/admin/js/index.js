//设置全局表单提交格式
Vue.http.options.emulateJSON = true;

const {body} = document;
const WIDTH = 1024;
const RATIO = 3;

const api = {
    articleCount: 'article/findAllCount.do',
    commentsCount: 'comments/findAllCount.do',
    tagsCount: 'tags/findAllCount.do',
    linksCount: 'links/findAllCount.do',
    info: 'admin/info.do',
    allArticle: 'article/findAll.do',
    allComments: 'comments/findAll.do'
};


// Vue实例
new Vue({
    el: '#app',
    data() {
        return {
            article: [{
                id: '',
                title: ''
            }],
            comments: [{
                id: '',
                author: '',
            }],

            defaultActive: '1',
            //===========参数===========
            article_count: '',
            comments_count: '',
            tags_count: '',
            links_count: '',
            token: {name: ''},

            mobileStatus: false, //是否是移动端
            sidebarStatus: true, //侧边栏状态，true：打开，false：关闭
            sidebarFlag: ' openSidebar ', //侧边栏标志
            
            personal:false,
	        log : false,
	        user:false,
	        role:false,
	        permissions:[]

        };
    },
    methods: {

        /**
         * 一些初始化参数
         */
        init() {
            //文章数量
            this.$http.get(api.articleCount).then(result => {
                this.article_count = result.body.data;
            });
            //评论数量
            this.$http.get(api.commentsCount).then(result => {
                this.comments_count = result.body.data;
            });
            //标签数量
            this.$http.get(api.tagsCount).then(result => {
                this.tags_count = result.body.data;
            });
            //友链数量
            this.$http.get(api.linksCount).then(result => {
                this.links_count = result.body.data;
            });
            //已登录用户名
            this.$http.get(api.info).then(result => {
                this.token.name = result.body.data.username;
            });
            //最新文章
            this.$http.get(api.allArticle).then(result => {
                this.article = result.body.data;
            });
            //最新评论
            this.$http.get(api.allComments).then(result => {
                this.comments = result.body.data;
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

    created() {
        this.init(); //初始化
        const isMobile = this.isMobile();
        if (isMobile) {
            //手机访问
            this.sidebarFlag = ' hideSidebar mobile ';
            this.sidebarStatus = false;
            this.mobileStatus = true;
        }

    },
    mounted : function() {
		this.$http.post('/SSM-QX-SYS-V1.01/role/doFindCurrentMenus.do').then(result => {
			this.permissions = result.data.data;
			for(var i =0;i<this.permissions.length;i++){
				switch(this.permissions[i]){
					case 'sys:personal':
						this.personal=true;
						   break;
					case 'sys:log':
						this.log = true;
                        break;
					case 'sys:user':
						this.user = true;
                        break;
					case 'sys:role':
						this.role = true;
                        break;
					case 'sys:root':
						this.role = true;
						this.user = true;
						this.log = true;
						this.personal=true;
                        break;
				}
			}
        });
    }

});

