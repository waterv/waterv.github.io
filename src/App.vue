<template>
  <v-app id="v-app" class="safe-top" @touchstart.stop.prevent>
    <v-app-bar class="app-bar padding-safe-left" color="primary" app dark short>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-badge :value="$root.isAppNew('/apps')" color="white" dot>
          <v-icon v-text="'mdi-menu'" />
        </v-badge>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ $root.getTitle(this.$route.fullPath) }}
      </v-toolbar-title>
      <v-spacer />
      <v-toggle
        v-if="$route.fullPath.lastIndexOf('/') != 0"
        :checked="$root.isAppFavor($route.fullPath)"
        @change="$root.toggleAppFavor($route.fullPath)"
        color=""
        icon="mdi-star"
        unchecked-icon="mdi-star-outline"
      />
    </v-app-bar>

    <v-main
      :class="{
        'app-main': ['xs', 'sm', 'md'].includes($vuetify.breakpoint.name),
      }"
    >
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-fab-transition>
      <v-btn v-show="vConsole" v-bind="fabButton" @click="vConsole.show()">
        <v-icon v-text="'mdi-console'" />
      </v-btn>
    </v-fab-transition>

    <v-navigation-drawer
      v-model="drawer"
      app
      class="no-select padding-safe-left"
    >
      <template #prepend>
        <random-slogan @snackbar="arg => (sloganSnackbar = arg)" />
        <v-divider />
      </template>

      <!-- Navigation -->
      <v-list nav dense>
        <template v-for="cate in $root.sortedApps">
          <v-subheader v-if="cate.name != ''" :key="cate.name">
            {{ $t(`route.${cate.name}._`) }}
          </v-subheader>

          <template v-for="app in cate.apps">
            <v-list-item
              color="primary"
              :key="app.fullPath"
              :to="app.fullPath"
              replace
            >
              <v-list-item-icon>
                <v-badge :value="$root.isAppNew(app.fullPath)" dot overlap>
                  <v-icon v-text="app.icon" />
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $root.getTitle(app.fullPath) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>

        <v-divider />

        <v-subheader>
          {{
            $t('settings.version', [
              $day(version.time).format('YYYY-MM-DD HH:mm:ss'),
            ])
          }}
        </v-subheader>
      </v-list>

      <template #append>
        <v-divider />
        <div
          class="px-4 mt-3 overflow-x-auto overflow-y-hidden navigation-operations"
        >
          <dice-widget v-if="$root.isWidgetFavor('dice')" />
          <wooden-fish v-if="$root.isWidgetFavor('woodenFish')" />
          <locale-setting v-if="$root.isWidgetFavor('locale')" />
          <theme-setting v-if="$root.isWidgetFavor('theme')" />
          <palette-setting v-if="$root.isWidgetFavor('palette')" />

          <!-- VConsole -->
          <v-toggle
            v-if="$root.isWidgetFavor('vconsole')"
            :checked="!!vConsole"
            icon="mdi-console"
            @change="toggleVConsole"
          />

          <!-- Settings -->
          <v-btn
            v-if="$root.isWidgetFavor('settings')"
            active-class="primary--text"
            icon
            to="/settings"
            replace
          >
            <v-icon v-text="'mdi-cog'" />
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-snackbar v-model="sloganSnackbar.open" class="safe-bottom">
      {{
        $t(`settings.sloganSnackbar[${sloganSnackbar.no}]`, sloganSnackbar.data)
      }}
    </v-snackbar>

    <v-snackbar v-model="$root.copyError" class="safe-bottom">
      {{ $t('clipboard.error') }}
    </v-snackbar>

    <v-snackbar v-model="$root.copySuccess" class="safe-bottom">
      {{ $t('clipboard.success') }}
    </v-snackbar>
  </v-app>
</template>

<script>
import VConsole from 'vconsole'
import VToggle from '@/components/VToggle.vue'
import RandomSlogan from '@/components/widgets/RandomSlogan.vue'
import DiceWidget from '@/components/widgets/DiceWidget.vue'
import WoodenFish from '@/components/widgets/WoodenFish.vue'
import LocaleSetting from '@/components/widgets/LocaleSetting.vue'
import ThemeSetting from '@/components/widgets/ThemeSetting.vue'
import PaletteSetting from '@/components/widgets/PaletteSetting.vue'

export default {
  name: 'App',
  components: {
    VToggle,
    RandomSlogan,
    DiceWidget,
    WoodenFish,
    LocaleSetting,
    ThemeSetting,
    PaletteSetting,
  },
  data: () => ({
    version: require('@/data/time.json'),

    drawer: false,
    sloganSnackbar: {
      open: false,
      no: -1,
      data: [],
    },

    vConsole: undefined,
    fabButton: {
      fab: true,
      dark: true,
      fixed: true,
      bottom: true,
      right: true,
      id: 'fab',
      class: 'ma-4',
      color: 'primary',
    },
  }),
  methods: {
    toggleVConsole() {
      if (this.vConsole) {
        this.vConsole.destroy()
        this.vConsole = undefined
      } else {
        this.vConsole = new VConsole({
          theme: this.$root.theme ? 'dark' : 'light',
        })
        this.vConsole.hideSwitch()
      }
    },
  },
}
</script>
