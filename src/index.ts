import { Helper } from "../src/helper/helper"
import { Type } from "../src/type/type"
import { v4 as uuidv4 } from 'uuid';

class OriginalInputHandler {
    private newline_replace: string

    constructor() {
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
        var en_uuid = new Map()
        var uuid_index = new Array()
        en_uuid = this.content_to_uuid(doc.documentElement, en_uuid)
        const converted_element = document.getElementById("converted")
        const original_string_element = document.getElementById("original-string-list")

        // if (converted_element) {
        //     converted_element.replaceWith(doc.documentElement)
        // }
        console.log(en_uuid)

        if (original_string_element) {
            original_string_element.innerHTML = this.uuid_list_to_textarea(en_uuid, uuid_index)
        }
        console.log(uuid_index)
        if (translated_element) {
            const uuid_ja = this.translated_text_to_map(translated_element.value, uuid_index)
            this.content_from_uuid(doc.documentElement, uuid_ja)
            converted_element?.replaceWith(doc.documentElement)
        }


    }

    private translated_text_to_map(translated_str: string, uuid_index: Array<Type.uuid>): Map<Type.uuid, string> {
        const list = translated_str.split('\n')
        var map = new Map()
        for (var i = 0; i < list.length; i++) {
            list[i] = list[i].replace(this.newline_replace, '\n')
            map.set(uuid_index[i], list[i])
        }

        return map
    }

    private uuid_list_to_textarea(uuid_list: Map<Type.uuid, string>, uuid_index: Array<Type.uuid>): string {
        var str = ""
        uuid_list.forEach((v, k) => {
            uuid_index.push(k)
            str += v + "\n"
        })
        return `<textarea class="form-control" id=${1}>${str}</textarea></li>`
    }


    private content_to_uuid(node: Node, map: Map<Type.uuid, string>): Map<Type.uuid, string> {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(node => {
                if (node.nodeName == "script") {

                }
                this.content_to_uuid(node, map)
            })
        } else {
            const content = node.textContent
            // const content = node.textContent?.replace('\n', this.newline_replace)
            if (content) {
                if (content === '\n') return map
                const uuid = uuidv4()
                map.set(uuid, content)
                node.textContent = uuid
            }
        }
        return map
    }

    private content_from_uuid(node: Node, map: Map<Type.uuid, string>) {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(node => {
                this.content_from_uuid(node, map)
            })
        } else {
            const content = node.textContent
            if (content) {
                const value = map.get(content)
                if (value) {
                    node.textContent = value
                }
            }
        }
    }


}

window.onload = () => {
    var handler = new OriginalInputHandler();
    document.getElementById("original")?.addEventListener("input", handler.doWork);
    document.getElementById("translated")?.addEventListener("input", handler.doWork);
};