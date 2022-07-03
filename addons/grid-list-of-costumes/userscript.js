export default async function ({ addon, global, console, msg }) {
    function classNames(...names) {
        const _classNames = {
            defaultLayout: "sa-default-layout-button sa-costume-editor-layout-button",
            gridLayout: "sa-grid-layout-button sa-costume-editor-layout-button",
            toggledOff: "sa-costume-editor-layout-button-toggled-off"
        };

        return names.map(name => _classNames[name]).join(" ");
    }

    function style(element, styles) {
        if (!styles) {
            element.style = "";
            return;
        }

        const keys = Object.keys(styles)
        const values = Object.values(styles)

        for (let i = 0; i < keys.length; i++) {
            element.style[keys[i]] = values[i]
        }
    }

    let layout = "default"
    
    while (true) {
        let costumeListArea = await addon.tab.waitForElement(
            'div[class*="selector_list-area"]',
            { markAsSeen: false }
        );

        let costumeListWrapper = await addon.tab.waitForElement(
            'div[class*="selector_wrapper"]',
            { markAsSeen: true }
        )

        let paintEditor = await addon.tab.waitForElement(
            'div[class*="asset-panel_detail-area"]',
            { markAsSeen: true }
        );

        if (layout === "grid") {
            for (let element of costumeListArea.childNodes) {
                style(element.firstChild, { margin: "0.5rem" })
            }
            console.log("a")
        } else {
            console.log(layout)
        }

        const row = document.createElement("div");
        row.className = "sa-costume-editor-layout-row";

        const gridLayout = document.createElement("span");
        gridLayout.className = classNames("gridLayout", "toggledOff");
        gridLayout.onclick = function() {
            layout = "grid"
            defaultLayout.className = classNames("defaultLayout", "toggledOff");
            gridLayout.className = classNames("gridLayout");
            style(paintEditor, { display: "none" });
            style(costumeListWrapper, { 
                width: "100%",
                "justify-content": "normal"
            });
            style(costumeListArea, { 
                "flex-direction": "row",
                "flex-wrap": "wrap",
                "flex-grow": "0",
                "overflow-y": "auto",
                height: "auto",
                padding: "0 0.5rem"
            });

            costumeListArea.classList.add("sa-costume-grid-list-area")
        }
        
        const defaultLayout = document.createElement("span");
        defaultLayout.className = classNames("defaultLayout")
        defaultLayout.onclick = function() {
            layout = "default"
            defaultLayout.className = classNames("defaultLayout");
            gridLayout.className = classNames("gridLayout", "toggledOff");
            style(paintEditor);
            style(costumeListWrapper);
            style(costumeListArea);

            costumeListArea.classList.remove("sa-costume-grid-list-area")
        }

        const gridLayoutIcon = document.createElement("img");
        gridLayoutIcon.className = "sa-grid-layout-button-icon";
        gridLayoutIcon.src = addon.self.dir + "/assets/grid-layout.svg";
        gridLayoutIcon.draggable = false;

        const defaultLayoutIcon = document.createElement("img");
        defaultLayoutIcon.className = "sa-default-layout-button-icon";
        defaultLayoutIcon.src = addon.self.dir + "/assets/default-layout.svg";
        defaultLayoutIcon.draggable = false;

        gridLayout.appendChild(gridLayoutIcon);
        defaultLayout.appendChild(defaultLayoutIcon);
        row.appendChild(gridLayout);
        row.appendChild(defaultLayout)

        costumeListArea.before(row);
    }
};