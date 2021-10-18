<template>
    <div class="container d-flex flex-column" id="app" >
        <div v-for="post in invalidPosts" @click="slideToPost(post)" :key="post.id" class="card p-4 my-3" style="background: #f5f5f5" :ref="`post-${post.id}`">
            <div class="row">
                <div class="shadow col-12 col-xl-10">
                    <div class="row">
                        <div class="col-12 py-1 d-flex flex-row justify-content-between" style="border-bottom: 1px solid #ebebeb; font-size: 0.9rem">
                            <div>
                                <a href="#" class="text-decoration-none">{{ post.publishDate }}</a> - {{ dateNormalFormat(post.publishDateString) }}
                            </div>
                            <div>
                                <b-icon-person class="me-2"/>
                                <a href="#" class="text-decoration-none">{{ post.ownerLogin }}</a>
                            </div>
                        </div>
                        <div class="col-12 pt-2 d-flex flex-row">
                            <h5 style="font-size: 1.5rem; text-align: start">{{ post.bulletinSubject }}</h5>
                        </div>
                        <div class="col-12 col-md-8" style="text-align: start;">
                            {{ post.bulletinText }}
                        </div>
                        <div class="col-12 col-md-4 d-flex flex-row justify-content-center flex-md-column justify-content-md-start py-2" style="border-left: 1px solid #ebebeb">
                            <img v-if="typeof post.bulletinImagees === 'string'" :src="post.bulletinImagees" class="m-1" style="object-fit: contain; max-height: 170px; max-width: 170px" />
                            <div v-else>
                                <img v-for="(image, idx) in post.bulletinImagees" :key="idx" :src="image" class="m-1" style="object-fit: contain; max-height: 170px; max-width: 170px" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-2 d-flex flex-column">
                    <div v-for="m in menu" :key="m.title" class="moderator-menu"><b>{{ m.title }}&nbsp;</b>
                        <span v-if="m.color" :style="`font-size: 1.5rem; color: ${ m.color }`">•</span>
                        <span v-else>&nbsp;</span>
                        <b style="color: gray ">&nbsp;{{ m.action }}</b>
                    </div>
                    <b-icon-check-circle v-if="validPosts[post.id]" style="color: green" />
                </div>
            </div>
        </div>
        <div ref="lastElement" class="text-center" style="height: 100vh">
            <h2 v-if="areAllPostsChecked"> Нажмите на 7 для отправки решений на сервер<span v-if="invalidPosts.length === 10">&nbsp; и загрузки новых постов</span> </h2>
        </div>
        <b-modal hide-footer hide-header ref="exampleModal">
            <div class="modal-content">
                <textarea v-model="comment"/>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$refs.exampleModal.hide()">Закрыть</button>
                    <button type="button" class="btn btn-primary" @click="addComment">Сохранить</button>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import dateFormat from "dateformat";
    export default {
        name: 'App',
        computed: {
            areAllPostsChecked() {
                return Boolean(this.validPosts[this.invalidPosts[this.invalidPosts.length - 1]?.id]);
            }
        },
        methods: {
            dateNormalFormat(date) {
                let d = new Date(date);
                return dateFormat(d, "fullDate")
            },
            async requestPosts() {
                let response =  await this.axios.get(`http://localhost:3500/posts?offset=${this.offset}&limit=10`);
                if( response.status === 200) {
                    this.invalidPosts = response.data.values;
                    this.offset += 10;
                    this.focusElementId = this.invalidPosts[0].id;
                    window.scrollTo(0,0);
                }

            },
            slideToPost(post) {
                this.focusElementId = post.id;
                console.log(this.$refs[`post-${post.id}`]);
                let slide = this.$refs[`post-${post.id}`][0];
                let top = window.scrollY + slide.getBoundingClientRect().y;
                window.scrollTo(0, top);
            },
            addComment() {
                this.validPosts[this.focusElementId].comment = this.comment;
                this.$refs.exampleModal.hide();
                this.comment = '';
                this.nextPost();
            },
            nextPost(e = null) {
                let idxFocusPost = this.invalidPosts.findIndex((p) => p.id === this.focusElementId);
                if(idxFocusPost < this.invalidPosts.length - 1){
                    this.focusElementId = this.invalidPosts[idxFocusPost + 1].id
                    let slide = this.$refs[`post-${this.focusElementId}`][0]
                    let top = window.scrollY + slide.getBoundingClientRect().y;
                    window.scrollTo(0, top);
                } else if ( idxFocusPost === this.invalidPosts.length - 1 ){
                    let slide = this.$refs['lastElement'][0]
                    let top = window.scrollY + slide.getBoundingClientRect().y;
                    window.scrollTo(0, top);
                }
                if(e) e.preventDefault();
            },
            keyup(e) {
                console.log(e);
                if( e.key === 'Enter' && e.shiftKey) this.keyupShiftEnter();
                else if( e.key === 'Enter' ) this.keyupEnter();
                else if( e.key.toUpperCase() === 'D' ) this.keyupDel();
                else if( e.key === '7' ) this.keyupSeven();
                else if( e.key === ' ' ) {
                    this.keyupSpace(e);
                }
            },
            keyupEnter() {
                if( this.invalidPosts.length < 1) {
                    this.requestPosts();
                }
            },
            keyupSpace(e) {
                if( this.invalidPosts.length > 0 ) {
                    this.$set(this.validPosts, this.focusElementId, {status: 'approve', comment: ''});
                    this.nextPost(e);
                }
            },
            keyupDel() {
                if( this.invalidPosts.length > 0 ) {
                    this.$set(this.validPosts, this.focusElementId, { status: 'decline' });
                    this.$refs.exampleModal.show();
                }
            },
            keyupShiftEnter() {
                if( this.invalidPosts.length > 0 ) {
                    this.$set(this.validPosts, this.focusElementId, { status: 'escalate' });
                    this.$refs.exampleModal.show();
                }
            },
            keyupSeven() {
                if( this.areAllPostsChecked ) {
                    Object.entries(this.validPosts).forEach(([id, value]) => {console.log({ ...value, postId: id});this.axios.post('http://localhost:3500/checked_posts/add', {postId: id, ...value})})
                    this.invalidPosts = [];
                    this.validPosts = {};
                    this.requestPosts();
                } else {
                    alert('Не все посты были проверены')
                }
            },
        },
        created() {
            window.addEventListener('keypress', this.keyup);
        },
        destroyed() {
            window.removeEventListener('keypress', this.keyup);
        },
        data:() => ({
            offset: 0,
            isShowDialog: false,
            comment: '',
            invalidPosts: [],
            validPosts: {},
            focusElementId: 0,
            menu: [
                {
                    'title': 'Одобрить',
                    'color':'darkseagreen',
                    'action': 'Пробел',
                },
                {
                    'title': 'Отклонить',
                    'color': 'orange',
                    'action': 'D',
                },
                {
                    'title': 'Эскалация',
                    'color': 'blue',
                    'action': 'Shift+Enter',
                },
                {
                    'title': 'Сохранить',
                    'action': '7',
                },
            ]
        })
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .moderator-menu {
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        height: 36px;
    }
</style>
