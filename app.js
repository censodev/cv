import { ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import CvHeader from './cv-header.js'

export default {
    components: {
        CvHeader,
    },
    setup() {
        const cv = ref({})

        const urlSearchParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        const id = params.id ?? 1
        fetchCV(id).then(data => cv.value = data)

        async function fetchCV(id) {
            const res = await fetch(`data.${id}.json`)
            return await res.json()
        }

        function fmtDate(year, month) {
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            if (!year)
                return 'present'
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
    template: `
        <div class="cv d-flex flex-column">
            <!-- CV HEADER - START -->
            <CvHeader :cv="cv" />
            <!-- CV HEADER - END -->
            <!-- CV BODY - START -->
            <div class="cv-body p-5 flex-grow-1">
                <!-- EDUCATION - START -->
                <div class="cat-title">
                    <div class="cat-icon">
                        <i class="bi bi-book-fill"></i>
                    </div>
                    <h5 class="ps-3 m-0 fw-bold">EDUCATION</h5>
                </div>
                <div class="d-flex flex-column gap-3 mt-3">
                    <div v-for="edu in cv.edu">
                        <div class="d-flex">
                            <div><b class="text-uppercase" v-html="edu.school"></b></div>
                            <div class="ms-auto"><small><b class="text-uppercase">{{fmtDate(edu.startDtYr, edu.startDtMo)}} - {{fmtDate(edu.endDtYr, edu.endDtMo)}}</b></small></div>
                        </div>
                        <div class="fw-light">
                            <small>{{edu.degree}}, {{edu.spec}}</small>
                            <small class="d-block text-secondary" v-if="edu.grade">Grade: {{edu.grade}}</small>
                        </div>
                    </div>
                </div>
                <!-- EDUCATION - END -->
                <!-- EXPERIENCE - START -->
                <div class="cat-title mt-5">
                    <div class="cat-icon">
                        <i class="bi bi-wallet-fill"></i>
                    </div>
                    <h5 class="ps-3 m-0 fw-bold">EXPERIENCE</h5>
                </div>
                <div class="d-flex flex-column gap-3 mt-3">
                    <div v-for="exp in cv.exp">
                        <div class="d-flex">
                            <div><b class="text-uppercase">{{exp.title}}</b></div>
                            <div class="ms-auto"><small><b class="text-uppercase">{{fmtDate(exp.startDtYr, exp.startDtMo)}} - {{fmtDate(exp.endDtYr, exp.endDtMo)}}</b></small></div>
                        </div>
                        <div class="fw-light"><small>{{exp.company}} • {{exp.empType}} • {{fmtDuration(exp.startDtYr, exp.startDtMo, exp.endDtYr, exp.endDtMo)}}</small></div>
                        <div class="text-secondary fw-light"><small>{{exp.location}}</small></div>
                    </div>
                </div>
                <!-- EXPERIENCE - END -->
                <!-- SKILLS - START -->
                <div class="cat-title mt-5">
                    <div class="cat-icon">
                        <i class="bi bi-pen-fill"></i>
                    </div>
                    <h5 class="ps-3 m-0 fw-bold">SKILLS</h5>
                </div>
                <div class="d-flex flex-column gap-3 mt-3">
                    <ul id="cvSkills" style="list-style: square">
                        <li v-for="skv, skk in cv.skills" class="fw-light">{{skk}}: <b>{{skv}}</b></li>
                    </ul>
                </div>
                <!-- SKILLS - END -->
                <!-- PROJECTS - START -->
                <div class="cat-title mt-5">
                    <div class="cat-icon">
                        <i class="bi bi-code"></i>
                    </div>
                    <h5 class="ps-3 m-0 fw-bold">PROJECTS</h5>
                </div>
                <div id="cvProjects" class="d-flex flex-column gap-4 mt-3">
                    <div v-for="prj in cv.projects">
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
                </div>
                <!-- PROJECTS - END -->
            </div>
            <!-- CV BODY - END -->
        </div>
    `,
}