import { Helper } from "../src/helper/helper"
import { Type } from "../src/type/type"
import { v4 as uuidv4 } from 'uuid';

class OriginalInputHandler {
    private uuid_en: Map<string, string>
    private uuid_ja: Map<string, string>
    private uuid_index: Array<string>
    private newline_replace: string

    constructor() {
        this.uuid_en = new Map()
        this.uuid_ja = new Map()
        this.uuid_index = new Array()
        this.newline_replace = uuidv4()
        var original_element = document.getElementById("original") as HTMLInputElement;
        this.showResult(original_element);
    }

    public doWork = () => {
        var original_element = document.getElementById("original") as HTMLInputElement;
        this.showResult(original_element);
    }


    private showResult(original_element: HTMLInputElement) {
        const domparser = new DOMParser()
        const doc = domparser.parseFromString(original_element.value, "text/html")
        const translated_element = document.getElementById("translated") as HTMLInputElement;

        const converted_to_uuid_element = this.content_to_uuid(doc.documentElement)
        const converted_element = document.getElementById("converted")
        const original_string_element = document.getElementById("original-string-list")

        if (converted_element) {
            converted_element.replaceWith(converted_to_uuid_element)
        }
        if (original_string_element) {
            original_string_element.innerHTML = (this.uuid_list_to_string(this.uuid_en))
        }
        if (translated_element) {
            const uuid_ja = this.translated_text_to_map(translated_element.value)
            console.log(uuid_ja)
            const element = this.content_from_uuid(converted_to_uuid_element, uuid_ja)
            converted_element.replaceWith(element)
        }


    }

    private translated_text_to_map(translated_str: string): Map<string, string> {
        const list = translated_str.split('\n')
        var map = new Map()
        for (var i = 0; i < list.length; i++) {
            list[i] = list[i].replace(this.newline_replace, '\n')
            map.set(this.uuid_index[i], list[i])
        }

        return map
    }

    private uuid_list_to_string(uuid_list: Map<any, string>): string {
        var str = ""
        uuid_list.forEach((v, k) => {
            this.uuid_index.push(k)
            str = str + v + "\n"
        })
        return `<textarea class="form-control" id=${1}>${str}</textarea></li>`
    }


    private content_to_uuid(element: Element): Element {
        var convered_to_uuid_element = element
        if (convered_to_uuid_element.children.length > 0) {
            if (convered_to_uuid_element.tagName == "P" || convered_to_uuid_element.tagName == "LI") {
                const content = convered_to_uuid_element.textContent

                if (content) {
                    const uuid = uuidv4()
                    this.uuid_en.set(uuid, content)
                    convered_to_uuid_element.textContent = content.replace('\n', this.newline_replace)
                    convered_to_uuid_element.textContent = uuid
                }
            }
            for (var i = 0; i < convered_to_uuid_element.children.length; i++) {
                this.content_to_uuid(convered_to_uuid_element.children[i])
            }
        } else {
            const content = convered_to_uuid_element.textContent
            if (content) {
                const uuid = uuidv4()
                this.uuid_en.set(uuid, content)
                convered_to_uuid_element.textContent = content.replace('\n', this.newline_replace)
                convered_to_uuid_element.textContent = uuid
            }
        }
        return convered_to_uuid_element
    }

    private content_from_uuid(element: Element, map: Map<string, string>): Element {
        var translated_docment = element
        if (translated_docment.children.length > 0) {
            if (translated_docment.tagName == "P" || translated_docment.tagName == "LI") {
                const content = translated_docment.textContent

                if (content) {
                    const value = map.get(content)
                    if (value) {
                        translated_docment.textContent = value
                    }
                }
            }
            for (var i = 0; i < translated_docment.children.length; i++) {
                this.content_to_uuid(translated_docment.children[i])
            }
        } else {
            const content = translated_docment.textContent
            if (content) {
                const value = map.get(content)
                if (value) {
                    translated_docment.textContent = value
                }
            }
        }

        return translated_docment
    }

    private show_content(element: Element) {
        if (element.children.length > 0) {
            for (var i = 0; i < element.children.length; i++) {
                this.show_content(element.children[i])
            }
        } else {
            const content = element.textContent
            if (content) {
                console.log(content)
            }
        }
    }


}

window.onload = () => {
    var handler = new OriginalInputHandler();
    document.getElementById("original")?.addEventListener("input", handler.doWork);
    document.getElementById("translated")?.addEventListener("input", handler.doWork);
    document.getElementById("char_limit")?.addEventListener("change", handler.doWork)
};