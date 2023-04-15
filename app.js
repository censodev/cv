import { ref } from 'vue'
import CvHeader from './components/cv-header.js'
import CvCat from './components/cv-cat.js'

export default {
    components: {
        CvHeader,
        CvCat,
    },
    setup() {
        const cv = ref({})

        const urlSearchParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        const id = params.id ?? 1
        fetchCV(id).then(data => cv.value = data)

        async function fetchCV(id) {
            const res = await fetch(`https://censodev.github.io/cv-data/${id}.json`)
            return await res.json()
        }

        function fmtDate(year, month, fmtForNullYear = 'present') {
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            if (!year)
                return fmtForNullYear
            else if (!month)
                return year
            return `${months[month - 1]} ${year}`
        }

        function fmtDuration(startYear, startMonth, endYear, endMonth) {
            const startDt = new Date(startYear, startMonth - 1, 1)
            const endDt = !endYear && !endMonth ? new Date() : new Date(endYear, endMonth - 1, 28)
            const duration = Math.ceil((endDt - startDt) / 24 / 30 / 3600 / 100 / 12) / 10
            const yrDuration = Math.floor(duration)
            const moDuration = Math.ceil((duration - yrDuration) * 10)
            return `${yrDuration} ${yrDuration > 1 ? 'yrs' : 'yr'} ${moDuration} ${moDuration > 1 ? 'mos' : 'mo'}`
        }

        return {
            cv,
            fmtDate,
            fmtDuration,
        }
    },
    template: /*html*/`
        <div class="cv d-flex flex-column">
            <!-- CV HEADER - START -->
            <CvHeader :cv="cv" />
            <!-- CV HEADER - END -->
            <!-- CV BODY - START -->
            <div class="cv-body p-5 flex-grow-1 d-grid gap-5">
                <!-- EDUCATION - START -->
                <CvCat icon="bi bi-book-fill" title="EDUCATION" v-if="cv.edu">
                    <div v-for="edu in cv.edu" class="pb-inside-avoid">
                        <div class="d-flex">
                            <div><b class="text-uppercase" v-html="edu.school"></b></div>
                            <div class="ms-auto"><small><b class="text-uppercase">{{fmtDate(edu.startDtYr, edu.startDtMo)}} - {{fmtDate(edu.endDtYr, edu.endDtMo)}}</b></small></div>
                        </div>
                        <div class="fw-light">
                            <small>{{edu.degree}}, {{edu.spec}}</small>
                            <small class="d-block text-secondary" v-if="edu.grade">Grade: {{edu.grade}}</small>
                        </div>
                    </div>
                </CvCat>
                <!-- EDUCATION - END -->
                <!-- EXPERIENCE - START -->
                <CvCat icon="bi bi-wallet-fill" title="EXPERIENCE" v-if="cv.exp">
                    <div v-for="exp in cv.exp" class="pb-inside-avoid">
                        <div class="d-flex">
                            <div><b class="text-uppercase">{{exp.title}}</b></div>
                            <div class="ms-auto"><small><b class="text-uppercase">{{fmtDate(exp.startDtYr, exp.startDtMo)}} - {{fmtDate(exp.endDtYr, exp.endDtMo)}}</b></small></div>
                        </div>
                        <div class="fw-light"><small>{{exp.company}} • {{exp.empType}} • {{fmtDuration(exp.startDtYr, exp.startDtMo, exp.endDtYr, exp.endDtMo)}}</small></div>
                        <div class="text-secondary fw-light"><small>{{exp.location}}</small></div>
                    </div>
                </CvCat>
                <!-- EXPERIENCE - END -->
                <!-- CERTIFICATES - START -->
                <CvCat icon="bi bi-patch-check-fill" title="CERTIFICATES" v-if="cv.certs">
                    <div v-for="cert in cv.certs" class="pb-inside-avoid">
                        <div class="d-flex fw-bold text-uppercase">
                            <div>{{cert.title}}</div>
                            <div class="ms-auto">
                                <small>{{fmtDate(cert.issuedDtYr, cert.issuedDtMo)}}</small>
                            </div>
                        </div>
                        <div class="fw-light"><small>{{cert.author}}</small></div>
                        <small class="d-block fw-light text-secondary">
                            <a :href="cert.link" class="text-secondary" target="_blank">
                                {{cert.link}}
                                <i style="font-size: 10px;" class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </small>
                    </div>
                </CvCat> 
                <!-- CERTIFICATES - END -->
                <!-- SKILLS - START -->
                <CvCat icon="bi bi-pen-fill" title="SKILLS" v-if="cv.skills">
                    <ul style="list-style: square" class="mb-0 ms-1">
                        <li v-for="skv, skk in cv.skills" class="fw-light pb-inside-avoid">{{skk}}: <b>{{skv}}</b></li>
                    </ul>
                </CvCat> 
                <!-- SKILLS - END -->
                <!-- PROJECTS - START -->
                <CvCat icon="bi bi-code" title="PROJECTS" v-if="cv.projects">
                    <div v-for="prj in cv.projects" class="pb-inside-avoid">
                        <div class="d-flex">
                            <div><b class="text-uppercase">{{prj.name}}</b></div>
                            <div class="ms-auto"><small><b class="text-uppercase">{{fmtDate(prj.startDtYr, prj.startDtMo)}} - {{fmtDate(prj.endDtYr, prj.endDtMo)}}</b></small></div>
                        </div>
                        <div class="mt-2 ms-4 ps-2 border-start border-3 fw-light">
                            <p><small>{{prj.des}}</small></p>
                            <p>
                                <small class="d-block">Market: <b>{{prj.market}}</b></small>
                                <small class="d-block">Technologies: <b>{{prj.tech.join(', ')}}</b></small>
                                <small class="d-block">Team: <b>{{prj.team}}</b></small>
                            </p>
                            <div>
                                <small>Role(s): <b>{{prj.role}}</b></small>
                                <small>
                                    <ul style="list-style: square">
                                        <li v-for="prjRole in prj.roleDes" class="fw-light">{{prjRole}}</li>
                                    </ul>
                                </small>
                            </div>
                        </div>
                    </div>
                    </CvCat>
                <!-- PROJECTS - END -->
            </div>
            <!-- CV BODY - END -->
        </div>
    `,
}