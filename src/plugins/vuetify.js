import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    values: {
      javascript: 'mdi-language-javascript',
      python: 'mdi-language-python',
      java: 'mdi-language-java',
      inline: 'mdi-form-textbox',
      null: '',
    },
  },
})
