
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    en: {
        message: {
            newTable: 'New table'
        }
    },
    ru: {
        message: {
            newTable: 'Новый стол'
        }
    }
}

export const i18n = new VueI18n({
    locale: 'en', // set locale
    messages, // set locale messages
})
