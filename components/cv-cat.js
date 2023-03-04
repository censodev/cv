export default {
    props: ['icon', 'title'],
    setup(props) {},
    template: `
        <div>
            <div class="cat-title">
                <div class="cat-icon">
                    <i class="bi" :class="icon"></i>
                </div>
                <h5 class="ps-3 m-0 fw-bold">{{title}}</h5>
            </div>
            <div class="d-flex flex-column gap-3 mt-3">
                <slot></slot>
            </div>
        </div>
    `,
}