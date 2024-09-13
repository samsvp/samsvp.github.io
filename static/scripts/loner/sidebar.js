function createOption(name, selected_name) {
    _class = name == selected_name ? 'class="active"' : "";
    let _name = name[0].toUpperCase() + name.slice(1);
    return `<a href="/loner-pop/${name}.html" ${_class}>${_name}</a>`
}

function createSidebar(active_name) {
    let html = ``
    for (const name of ["ansiedade", "solitude", "mentiras"]) {
        html += createOption(name, active_name);
    }

    let content = document.getElementsByClassName("content")[0];
    let div = document.createElement("div");
    div.classList.add("sidebar");
    div.innerHTML = html;
    content.before(div);
}
