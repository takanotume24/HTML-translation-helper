import { Helper } from "../src/helper/helper"
import { Type } from "../src/type/type"
import { v4 as uuidv4 } from 'uuid';

class OriginalInputHandler {
    private newline_replace: string

    constructor() {
        this.newline_replace = uuidv4()
        var original_element = document.getElementById("original_textarea") as HTMLInputElement;
        this.showResult(original_element);
    }

    public doWork = () => {
        var original_element = document.getElementById("original_textarea") as HTMLInputElement;
        this.showResult(original_element);
    }


    private showResult(original_element: HTMLInputElement) {
        const domparser = new DOMParser()
        const doc = domparser.parseFromString(original_element.value, "text/html")
        var en_set = new Set<string>()
        en_set = this.content_to_set(doc.documentElement, en_set)
        const converted_textarea = document.getElementById("converted_textarea")
        const translated_html = document.getElementById("translated_html")

        // if (converted_textarea) {
        //     converted_textarea.replaceWith(doc.documentElement)
        // }
        console.log(en_set)
        if (!converted_textarea) return null
        converted_textarea.textContent = this.set_to_textarea(en_set)

        const translated_textarea = document.getElementById("translated_textarea");
        if (!translated_textarea) return null

        console.log(translated_textarea.textContent)
        var map = this.translated_text_to_map(translated_textarea, converted_textarea)
        console.log(map)
        if (!map) return null
        this.content_from_map(doc.documentElement, map)
        translated_html?.replaceWith(doc.documentElement)
    }

    private translated_text_to_map(translated_element: HTMLElement, original_element: HTMLElement): Map<string, string> {
        var map = new Map<string, string>()
        const original_str = original_element.textContent
        const translated_str = translated_element.textContent
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
            // const content = node.textContent?.replace('\n', this.newline_replace)
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