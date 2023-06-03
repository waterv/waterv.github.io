<template>
  <div class="apps">
    <v-card class="mb-4 elevation-2">
      <v-card-text>
        <v-tabs v-model="tab" center-active show-arrows>
          <v-tab v-for="(cate, i) in cates" :key="i">
            {{ $t(`route.${cate}._`) }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" touchless>
          <v-tab-item v-for="(v, i) in cates" :key="i">
            <v-container>
              <v-row justify="start">
                <template v-for="(cate, j) in $root.apps">
                  <template v-for="app in cate.apps">
                    <v-col
                      :key="app.fullPath"
                      v-if="
                        app.fullPath != '/apps' &&
                        (i == 0 ||
                          (i == 1 && $root.isAppFavor(app.fullPath)) ||
                          i == j + 1)
                      "
                      class="d-flex flex-column align-center"
                      :cols="4"
                      :sm="3"
                      :md="2"
                    >
                      <v-btn
                        class="d-flex"
                        fab
                        icon
                        large
                        :color="$root.isAppFavor(app.fullPath) ? 'primary' : ''"
                        :to="app.fullPath"
                        replace
                      >
                        <v-badge :value="$root.isAppNew(app.fullPath)" dot>
                          <v-icon v-text="app.icon" />
                        </v-badge>
                      </v-btn>
                      <span class="d-flex text-center">
                        {{ $root.getTitle(app.fullPath) }}
                      </span>
                    </v-col>
                  </template>
                </template>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>

    <v-card class="elevation-2">
      <v-card-title>
        {{ $t('route.widget._') }}
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="start">
            <template v-for="widget in $root.widgets">
              <v-col
                :key="widget.name"
                class="d-flex flex-column align-center"
                :cols="4"
                :sm="3"
                :md="2"
              >
                <v-btn
                  class="d-flex"
                  fab
                  icon
                  large
                  :color="$root.isWidgetFavor(widget.name) ? 'primary' : ''"
                  @click="$root.toggleWidgetFavor(widget.name)"
                >
                  <v-icon v-text="widget.icon" />
                </v-btn>
                <span class="d-flex text-center">
                  {{ $t(`route.widget.${widget.name}`) }}
                </span>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AppsView',
  data: that => ({
    tab: 'all',
    cates: ['all', 'favor']
      .concat(that.$root.apps.map(cate => cate.name))
      .filter(name => name != ''),
  }),
  computed: {},
  methods: {},
}
</script>
