<template>
  <div class="draftbox">
    <v-editor
      v-model="$root.editorValue"
      ref="editor"
      :label="$t('draftbox.editorValue')"
      no-jump
      @save="getDrafts(true)"
    />

    <v-card class="my-4">
      <v-card-text>
        <v-select
          v-model="fromPath"
          :items="fromPathes"
          prepend-icon="mdi-at"
          outlined
          @change="getDrafts"
        />

        <v-list two-line>
          <v-list-item-group v-model="select" :multiple="selecting">
            <v-list-item
              v-for="v in items"
              :key="v.id"
              :value="v.id"
              @click="selecting ? void 0 : setCurrentDraft(v.id)"
              :color="selecting ? '' : 'primary'"
            >
              <v-list-item-content>
                <v-list-item-title :class="v.font">
                  {{ v.text }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ dayjs(v.time).format('YYYY-MM-DD HH:mm:ss') }} @
                  {{ $root.getTitle(v.path) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-pagination v-model="page" :length="pages" />
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          :color="selecting ? 'primary' : ''"
          @click="toggleSelecting()"
        >
          <v-icon v-text="'mdi-select'" />
          {{ $t('draftbox.select') }}
        </v-btn>

        <v-btn
          class="ml-2"
          text
          color="red"
          :disabled="deleteDisabled"
          @click="deleteSelectedDrafts"
        >
          <v-icon v-text="'mdi-delete'" />
          {{ $t('draftbox.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'

export default {
  name: 'DraftBox',
  components: { VEditor },
  data() {
    return {
      dayjs: require('dayjs'),
      fromPath: '',
      pathes: [
        '',
        '/',
        '/draftbox',
        '/editor/regexp',
        '/editor/tex',
        '/editor/ipa',
        '/editor/calc',
        '/converter/font',
      ],
      items: [],
      page: 1,
      pages: 1,
      select: this.$root.currentDraft,
      selecting: false,
    }
  },
  watch: {
    page() {
      this.getDrafts()
    },
    '$root.db': function () {
      this.getDrafts()
    },
  },
  async mounted() {
    this.getDrafts()
  },
  computed: {
    deleteDisabled() {
      return (
        this.select === 0 ||
        this.select === undefined ||
        this.select?.length === 0
      )
    },
    fromPathes() {
      return this.pathes.map(path => ({
        text: this.$root.getTitle(path) || this.$t('draftbox.allPath'),
        value: path,
      }))
    },
  },
  methods: {
    async getDrafts(isSave) {
      this.items = await (this.fromPath === ''
        ? this.$root.db.drafts
        : this.$root.db.drafts.where('path').equals(this.fromPath)
      )
        .reverse()
        .offset(10 * this.page - 10)
        .limit(10)
        .toArray()
      this.pages = Math.ceil((await this.$root.db.drafts.count()) / 10) || 1
      this.page = Math.max(Math.min(this.page, this.pages), 1)
      if (isSave && !this.selecting) this.select = this.$root.currentDraft
    },
    async setCurrentDraft(id) {
      this.$root.currentDraft = this.$root.currentDraft == id ? 0 : id
      this.$root.editorValue = (await this.$root.db.drafts.get(id)).text
    },
    async deleteSelectedDrafts() {
      let select = typeof this.select == 'number' ? [this.select] : this.select
      this.$root.db.drafts.bulkDelete(select)
      if (select.includes(this.$root.currentDraft)) this.$root.currentDraft = 0
      this.getDrafts()
    },
    toggleSelecting() {
      this.selecting = !this.selecting
      this.select = this.selecting ? [] : this.$root.currentDraft
    },
  },
}
</script>
