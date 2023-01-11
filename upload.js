function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

const noop = function () {}

export function upload(selector, option = {}) {
    let files = []
    const onUpload = option.onUpload ?? noop
    const input = document.querySelector(selector)
    const preview = element('div', ['preview'])
    const open = element('button', ['btn'], 'Открыть')
    const upload = element('button', ['btn', 'primary'], 'Загрузить')
    upload.style.display = 'none'

    if (option.multi) {
        input.setAttribute('multiple', true)
    }

    if (option.accept && Array.isArray(option.accept)) {
        input.setAttribute('accept', option.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)

    const triggerInput = () => input.click()

    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return
        }

        files = Array.from(event.target.files)

        preview.innerHTML = ''
        upload.style.display = 'inline'

        files.forEach((file) => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = (ev) => {
                const src = ev.target.result
                preview.insertAdjacentHTML(
                    'afterbegin',
                    `<div class="preview-image">
                    <div class="preview-remove" data-name="${
                        file.name
                    }">&times;</div>
                    <img src="${src}" alt="${file.name}"/>
                    <div class="preview-info">
                    <span>${file.name}</span>
                    ${formatBytes(file.size)}
                    </div>
                    </div>`
                )
            }

            reader.readAsDataURL(file)
        })
    }

    const removeHandler = (event) => {
        if (!event.target.dataset.name) {
            return
        }

        const { name } = event.target.dataset
        files = files.filter((file) => file.name !== name)

        if (!files.length) {
            upload.style.display = 'none'
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('removing')
        setTimeout(() => {
            block.remove()
        }, 300)
    }

    const clearPreview = (el) => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach((e) => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)
    }

    open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)
}
