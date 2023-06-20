<template>
  <v-list-item
    class="random-slogan"
    :class="{
      'random-slogan-disabled': !$root.isWidgetFavor('randomSlogan'),
    }"
    @click="random"
  >
    <v-list-item-content class="random-slogan-content">
      <v-list-item-title class="random-slogan-title text-h6">
        <v-icon v-text="'mdi-wrench'" />
        {{ title }}
      </v-list-item-title>
      <v-list-item-subtitle
        v-if="$root.isWidgetFavor('randomSlogan')"
        class="random-slogan-subtitle"
      >
        <v-skeleton-loader v-if="loading" type="paragraph" />
        <span v-else>{{ slogan }}</span>
        <span v-if="sloganApiName" class="random-slogan-from">
          © {{ sloganApiName }}
        </span>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'RandomSlogan',
  data: () => ({
    slogan_: '',
    slogans: require('@/data/slogan.json'),
    sloganApiName: '',
    no: -1,
    count: -1,
    statis: { 242: [0], 448: [0] },
    loading: false,
    controller: undefined,
  }),
  computed: {
    title() {
      if (this.$root.sloganApiUrl != '') return this.$t('app.name')
      switch (this.sloganNo) {
        default:
          return this.$t('app.name')
        // #458 "你的电脑遇到问题，需要重新启动。我们只收集某些错误信息，然后你可以重新启动。"
        case 458:
          return ':('
      }
    },
    slogan() {
      if (this.$root.sloganApiUrl != '') return this.slogan_
      return this.slogans[this.no]
    },
  },
  watch: {
    '$root.sloganApiUrl'() {
      this.random()
    },
  },
  mounted() {
    this.random()
  },
  methods: {
    random() {
      if (!this.$root.isWidgetFavor('randomSlogan')) return
      if (this.loading) {
        this.loading = false
        this.controller.abort()
        return
      }
      this.count += 1
      if (this.$root.sloganApiUrl == '') {
        this.sloganApiName = ''
        this.no = Math.floor(Math.random() * this.slogans.length)
        let temp
        let open = false
        switch (this.no) {
          default:
            break
          // #242 "猜猜看，你还要点几次才能再看到这条标语？"
          case 242:
            temp = this.statis[242][0]
            this.statis[242][0] = this.count - temp
            temp == 0 || (open = true)
            break
          // #448 "你会记得你点过多少次随机语录吗？"
          case 448:
            if (this.count == 0) break
            this.statis[448][0] = this.count
            this.$emit('snackbar', 448, this.statis[448])
            open = true
            break
        }
        if (open)
          this.$emit('snackbar', {
            open,
            no: this.no,
            data: this.statis[this.no],
          })
      } else {
        this.loading = true
        this.controller = new AbortController()
        this.$axios
          .get(this.$root.sloganApiUrl, {
            signal: this.controller.signal,
            params: {
              timestamp: new Date().getTime(),
            },
            headers: { Accept: 'application/json' },
          })
          .then(res => {
            this.loading = false
            let { data } = res
            console.log('[slogan]', data)
            this.slogan_ = eval(`\`${this.$root.sloganApiFormat}\``)
            this.sloganApiName = this.$root.sloganApiName
          })
          .catch(err => {
            this.loading = false
            console.log('[slogan]', err.message)
          })
      }
    },
  },
}
</script>

<style>
.random-slogan-content {
  height: 112px;
}

.random-slogan-disabled .random-slogan-content {
  height: calc(112px - calc(0.875rem * 1.2 * 3));
}

.random-slogan-title {
  align-self: first baseline;
}

.random-slogan-subtitle {
  height: calc(0.875rem * 1.2 * 3);
  line-clamp: 3 !important;
  -webkit-line-clamp: 3 !important;
  white-space: normal;
  align-self: first baseline;
}

.random-slogan-disabled .random-slogan-subtitle {
  display: none;
}

.random-slogan-from {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 0.4rem;
  font-weight: 100;
}
</style>
