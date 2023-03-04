const App = {
    data() {
        return {
            cv: {}
        }
    },
    mounted() {
        const urlSearchParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        const id = params.id ?? 1
        this.fetchCV(id).then(data => this.cv = data)
    },
    methods: {
        async fetchCV(id) {
            const res = await fetch(`data.json`)
            const cvs = await res.json()
            return cvs.find(cv => cv.id === id)
        },
        fmtDate(year, month) {
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            if (!year && !month)
                return 'present'
            return `${months[month - 1]} ${year}`
        },
        fmtDuration(startYear, startMonth, endYear, endMonth) {
            const startDt = new Date(startYear, startMonth - 1, 1)
            const endDt = !endYear && !endMonth ? new Date() : new Date(endYear, endMonth - 1, 28)
            const duration = Math.ceil((endDt - startDt) / 24 / 30 / 3600 / 100 / 12) / 10
            const yrDuration = Math.floor(duration)
            const moDuration = Math.ceil((duration - yrDuration) * 10)
            return `${yrDuration} ${yrDuration > 1 ? 'yrs' : 'yr'} ${moDuration} ${moDuration > 1 ? 'mos' : 'mo'}`
        },
    },
}

Vue.createApp(App).mount('#app')
