const App = {
    data() {
        return {
            cv: {}
        }
    },
    mounted() {
        this.fetchCV().then(data => this.cv = data)
    },
    methods: {
        async fetchCV() {
            const urlSearchParams = new URLSearchParams(window.location.search)
            const params = Object.fromEntries(urlSearchParams.entries())
            const lang = params.lang ?? 'en'
            const res = await fetch(`data.${lang}.json`)
            return await res.json()
        },
    },
}

Vue.createApp(App).mount('#app')
