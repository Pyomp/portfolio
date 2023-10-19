export class HTMLRange {
    element = document.createElement('label')

    oninput = (value) => { }

    constructor({
        title = 'Placeholder',
        min = 0,
        max = 1,
        step = 0.1,
        value = 1
    }) {
        this.element.textContent = title

        const shininessRange = document.createElement('input')
        shininessRange.style.marginLeft = 'auto'
        shininessRange.value = value.toString()
        shininessRange.type = 'range'
        shininessRange.min = min.toString()
        shininessRange.step = step.toString()
        shininessRange.max = max.toString()
        shininessRange.oninput = () => {
            this.oninput(shininessRange.valueAsNumber)
            shininessText.value = shininessRange.value
        }
        this.element.appendChild(shininessRange)

        const shininessText = document.createElement('input')
        shininessText.type = 'number'
        shininessText.value = value.toString()
        shininessText.min = min.toString()
        shininessText.max = max.toString()
        shininessText.oninput = () => {
            this.oninput(shininessRange.valueAsNumber)
            shininessRange.value = shininessText.value
        }
        this.element.appendChild(shininessText)
    }
}
