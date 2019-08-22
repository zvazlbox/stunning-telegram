var PagePost = Vue.extend({
    name: "PagePost",
    template: `
<div v-show="pages > 1" class="zrz-pager clearfix pd10 pos-r">
    <div>
      <div class="btn-group fl">
        <button
          v-for="page in cpages"
          :class="['empty',cpaged == page ? 'selected disabled' : '',page == 0 ? 'bordernone' : '']"
          @click.stop.self="go(page)"
        >
          {{page != 0 ? page : '...'}}
          <b :class="[locked && cpage == page ? 'loading' : '']"></b>
        </button>
      </div>
      <div class="jump-page fl" v-show="pages >= 7">
        <input type="number" :value="cpaged" @keyup.enter="jump($event)" />
      </div>
      <div class="pager-center">{{cpaged}}/{{pages}}</div>
      <div class="btn-pager fr fs13">
        <button :class="['empty',cpaged <= 1 ? 'disabled' : '']" @click.stop.self="go(cpaged-1)">❮</button>
        <button
          :class="['empty','navbtr',cpaged >= pages ? 'disabled' : '']"
          @click.stop.self="go(cpaged+1)"
        >❯</button>
      </div>
    </div>
  </div>
    `,
    props: ["paged", "pages"],
    data: function () {
        return {
            locked: false,
            cpage: 0,
            cpaged: parseInt(this.paged),
            cpages: this.pagesInit()
        };
    },
    created: function () {
        // window.addEventListener("scroll", this.autoLoadMore);
    },
    methods: {
        //计算分页
        pagesInit: function () {
            var pagearr = [];
            if (this.pages <= 7) {
                for (var i = 1; i <= this.pages; i++) {
                    pagearr.push(i);
                }
            } else {
                if (!this.cpaged) this.cpaged = this.paged;
                if (this.cpaged < 5) {
                    for (var i = 1; i <= this.pages; i++) {
                        if (i >= 6) break;
                        pagearr.push(i);
                    }
                    pagearr.push(0, this.pages);
                } else if (this.cpaged >= 5 && this.pages - 3 > this.cpaged) {
                    pagearr.push(1, 0);
                    for (var i = this.cpaged - 2; i <= this.cpaged + 2; i++) {
                        pagearr.push(i);
                    }
                    pagearr.push(0, this.pages);
                } else if (this.pages - 3 <= this.cpaged) {
                    pagearr.push(1, 0);
                    for (var i = this.cpaged - 3; i <= this.pages; i++) {
                        pagearr.push(i);
                    }
                }
            }
            return pagearr;
        },
        //分页，点击事件
        go: function (page) {
            if (
                this.locked === true ||
                this.cpaged == page ||
                page < 1 ||
                page > this.pages ||
                page == 0
            ) {
                return;
            }
            this.locked = true;
            this.cpage = page;

            window.location.href = "?page=" + page;
        },
        //跳转
        jump: function (event) {
            var val = event.target.value || event.target.previousElementSibling.value;
            this.go(parseInt(val));
        }
    },
    watch: {}


});