import { Helper } from "../src/helper/helper"
import { Type } from "../src/type/type"
import { v4 as uuidv4 } from 'uuid';

class OriginalInputHandler {
    private uuid_en: Map<Type.uuid, string>
    private uuid_ja: Map<Type.uuid, string>
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

    private translated_text_to_map(translated_str: string): Map<Type.uuid, string> {
        const list = translated_str.split('\n')
        var map = new Map()
        for (var i = 0; i < list.length; i++) {
            list[i] = list[i].replace(this.newline_replace, '\n')
            map.set(this.uuid_index[i], list[i])
        }

        return map
    }

    private uuid_list_to_string(uuid_list: Map<Type.uuid, string>): string {
        var str = ""
        uuid_list.forEach((v, k) => {
            this.uuid_index.push(k)
            str = str + v + "\n"
        })
        return `<textarea class="form-control" id=${1}>${str}</textarea></li>`
    }


    private content_to_uuid(node: Node): Node {
        var temp_node = node.cloneNode()
        if (temp_node.hasChildNodes()) {
            temp_node.childNodes.forEach(node => {
                temp_node = this.content_to_uuid(node)
            })
        } else {
            const content = temp_node.textContent
            if (content) {
                const uuid = uuidv4()
                this.uuid_en.set(uuid, content)
                temp_node.textContent = content.replace('\n', this.newline_replace)
                temp_node.textContent = uuid
            }
        }

        return temp_node
    }

    private content_from_uuid(node: Node, map: Map<Type.uuid, string>): Node {
        var translated_docment = node.cloneNode()
        if (translated_docment.hasChildNodes()) {
            translated_docment.childNodes.forEach(node => {
                translated_docment = this.content_from_uuid(node, map)
            })
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