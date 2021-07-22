import { Helper } from "../src/helper/helper"
import { Type } from "../src/type/type"
import { v4 as uuidv4 } from 'uuid';

class OriginalInputHandler {
    private newline_replace: string

    constructor() {
        this.newline_replace = uuidv4()
        var original_element = document.getElementById("original_textarea") as HTMLInputElement;
        var translated_textarea = document.getElementById("translated_textarea") as HTMLInputElement

        this.showResult(original_element, translated_textarea);
    }

    public doWork = () => {
        var original_element = document.getElementById("original_textarea") as HTMLInputElement;
        var translated_textarea = document.getElementById("translated_textarea") as HTMLInputElement
        this.showResult(original_element, translated_textarea);
    }


    private showResult(original_element: HTMLInputElement, translated_textarea: HTMLInputElement) {
        const domparser = new DOMParser()
        const doc = domparser.parseFromString(original_element.value, "text/html")
        var en_set = new Set<string>()
        en_set = this.content_to_set(doc.documentElement, en_set)
        const converted_textarea = document.getElementById("converted_textarea") as HTMLInputElement
        const translated_html = document.getElementById("translated_html") as HTMLParagraphElement

        if (!converted_textarea) return null
        converted_textarea.value = this.set_to_textarea(en_set)

        console.log(translated_textarea.value)
        var map = this.translated_text_to_map(translated_textarea, converted_textarea)
        console.log(map)

        if (!map) return null
        this.content_from_map(doc.documentElement, map)
        translated_html.replaceWith(doc.documentElement)
    }

    private translated_text_to_map(translated_element: HTMLInputElement, converted_element: HTMLInputElement): Map<string, string> {
        var map = new Map<string, string>()
        const original_str = converted_element.value
        const translated_str = translated_element.value
        if (!original_str) {
            map.set("original_str", "null")
            return map
        }
        if (!translated_str) {
            map.set("translated_str", "null")
            return map
        }
        const original_list = original_str.split('\n')
        const translated_list = translated_str.split('\n')

        original_list?.forEach((v, i) => {
            map.set(v, translated_list[i])
        })

        return map
    }

    private set_to_textarea(set: Set<string>): string {

        var str = ""
        set.forEach((v) => {
            str += v + "\n"
        })
        return str
    }


    private content_to_set(node: Node, set: Set<string>): Set<string> {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(node => {
                if (node.nodeName == "script") {

                }
                this.content_to_set(node, set)
            })
        } else {
            const content = node.textContent
            if (content) {
                set.add(content)
            }
        }
        return set
    }

    private content_from_map(node: Node, map: Map<string, string>) {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(node => {
                this.content_from_map(node, map)
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
    document.getElementById("original_textarea")?.addEventListener("input", handler.doWork);
    document.getElementById("translated_textarea")?.addEventListener("input", handler.doWork);
};