import { Helper } from "../src/helper/helper"
import { Type } from "../src/type/type"
import { v4 as uuidv4 } from 'uuid';

class OriginalInputHandler {
    private char_limit: number
    private uuid_en: Map<any, string>

    constructor() {
        this.char_limit = 4500
        this.uuid_en = new Map()
        var original_element = document.getElementById("original") as HTMLInputElement;
        this.showResult(original_element);
    }

    public doWork = () => {
        var original_element = document.getElementById("original") as HTMLInputElement;
        this.showResult(original_element);
    }


    private showResult(original_element: HTMLInputElement) {
        const domparser = new DOMParser()
        var doc = domparser.parseFromString(original_element.value, "text/html")

        this.show_content(doc.documentElement)
        this.content_to_uuid(doc.documentElement)
        this.show_content(doc.documentElement)
        const converted_element = document.getElementById("converted")

        if (converted_element) {
            converted_element.replaceWith(doc.documentElement)
        }
        console.log(this.uuid_en)
    }

    private content_to_uuid(element: Element) {
        if (element.children.length > 0) {
            if (element.tagName == "P" || element.tagName == "LI") {
                const content = element.textContent

                if (content) {
                    const uuid = uuidv4()
                    this.uuid_en.set(uuid, content)
                    element.textContent = uuid
                }
            }
            for (var i = 0; i < element.children.length; i++) {
                this.content_to_uuid(element.children[i])
            }
        } else {
            const content = element.textContent
            if (content) {
                const uuid = uuidv4()
                this.uuid_en.set(uuid, content)
                element.textContent = uuid
            }
        }
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


    private split_array(strings: Type.strings): Type.columns {

        var char_count = 0
        var results = []
        var i = 0

        while (i < strings.length) {
            var new_array: Type.strings = []
            while (char_count < this.char_limit) {
                if (strings.length <= i) {
                    break
                }
                if (char_count + strings[i].length > this.char_limit) {
                    break
                }
                new_array.push(strings[i])
                char_count += strings[i].length
                i++

            }
            char_count = 0
            results.push(new_array)
        }
        const results_deleted_period = Helper.delete_last_period(results)
        const results_deleted_empty_string = Helper.delete_last_empty_string(results_deleted_period)
        return results_deleted_empty_string
    }
}

window.onload = () => {
    var handler = new OriginalInputHandler();
    document.getElementById("original")?.addEventListener("input", handler.doWork);
    document.getElementById("char_limit")?.addEventListener("change", handler.doWork)
};