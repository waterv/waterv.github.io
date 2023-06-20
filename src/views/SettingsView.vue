<template>
  <div class="settings">
    <v-expansion-panels v-model="panel" class="mt-4">
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('route.widget.randomSlogan') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-select
            v-model="sloganApiIndex"
            :label="$t('settings.sloganApi')"
            :items="sloganApis"
            item-text="name"
            item-value="index"
            :hint="sloganApi.home"
            outlined
            persistent-hint
          />
          <v-divider class="mb-4" />
          <v-text-field
            v-model="$root.sloganApiName"
            :label="$t('settings.sloganApiName')"
          />
          <v-text-field
            v-model.lazy="$root.sloganApiUrl"
            :label="$t('settings.sloganApiUrl')"
          />
          <v-text-field
            v-model="$root.sloganApiFormat"
            :label="$t('settings.sloganApiFormat')"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('settings.clearCache') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-shield-lock'" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-number-field
                  v-model="answer"
                  :label="$t('settings.clearValid', [validQuestionStr])"
                  outlined
                  dense
                  hide-details
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(v, i) in clearItems"
              :key="i"
              :disabled="!valid"
              @click="v.action"
            >
              <v-list-item-icon>
                <v-icon v-text="v.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('settings.clear', [v.item]) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(`settings.clearHint.${v.item}`) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import VNumberField from '@/components/VNumberField.vue'

export default {
  name: 'SettingView',
  components: { VNumberField },
  data: that => ({
    panel: 0,
    sloganApiIndex: undefined,
    sloganApis: require('@/data/slogan_api.json').map((v, index) => ({
      ...v,
      index,
    })),
    clearItems: [
      {
        item: 'localStorage',
        icon: 'mdi-archive-remove',
        action: that.clearLocalStorage,
      },
      {
        item: 'IndexedDB',
        icon: 'mdi-database-remove',
        action: that.clearIndexedDB,
      },
    ],
    validQuestion: [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 10),
    ],
    answer: null,
  }),
  computed: {
    sloganApi() {
      return this.sloganApis[this.sloganApiIndex ?? 0]
    },
    validQuestionStr() {
      return (
        this.validQuestion[0] +
        [' + ', ' − ', ' × '][this.validQuestion[1]] +
        this.validQuestion[2]
      )
    },
    valid() {
      return (
        eval(
          this.validQuestion[0] +
            '+-*'[this.validQuestion[1]] +
            this.validQuestion[2]
        ) === this.answer
      )
    },
  },
  watch: {
    '$root.locale'() {
      this.sloganApis[0].name = this.$t('app.name')
    },
    sloganApiIndex(i) {
      let api = this.sloganApi
      this.$root.sloganApiName = i == 0 ? '' : api.name
      this.$root.sloganApiUrl = api.url
      this.$root.sloganApiFormat = api.format
    },
  },
  mounted() {
    this.sloganApis[0].name = this.$t('app.name')
  },
  methods: {
    clearLocalStorage() {
      localStorage?.clear()
      this.$router.go(0)
    },
    clearIndexedDB() {
      this.$root.db.delete()
      this.$router.go(0)
    },
  },
}
</script>
