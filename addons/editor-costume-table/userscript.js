export default async function ({ addon, global, console, msg }) {
    function classNames(...names) {
        const _classNames = {
            defaultLayout: "sa-default-layout-button sa-costume-editor-layout-button",
            tableLayout: "sa-table-layout-button sa-costume-editor-layout-button",
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
    
    while (true) {
        let costumeListArea = await addon.tab.waitForElement(
            'div[class*="selector_list-area"]',
            { markAsSeen: true }
        );

        let costumeListWrapper = await addon.tab.waitForElement(
            'div[class*="selector_wrapper"]',
            { markAsSeen: true }
        )

        let paintEditor = await addon.tab.waitForElement(
            'div[class*="asset-panel_detail-area"]',
            { markAsSeen: true }
        );

        let costumeSelectors = costumeListArea.childNodes;

        const row = document.createElement("div");
        row.className = "sa-costume-editor-layout-row";

        const tableLayout = document.createElement("span");
        tableLayout.className = classNames("tableLayout", "toggledOff");
        tableLayout.onclick = function() {
            defaultLayout.className = classNames("defaultLayout", "toggledOff");
            tableLayout.className = classNames("tableLayout");
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
            for (let element of costumeSelectors) {
                style(element.firstChild, { margin: "0.5rem" })
            }
        }
        
        const defaultLayout = document.createElement("span");
        defaultLayout.className = classNames("defaultLayout")
        defaultLayout.onclick = function() {
            defaultLayout.className = classNames("defaultLayout");
            tableLayout.className = classNames("tableLayout", "toggledOff");
            style(paintEditor);
            style(costumeListWrapper);
            style(costumeListArea);
            for (let element of costumeSelectors) {
                style(element.firstChild)
            }
        }

        const tableLayoutIcon = document.createElement("img");
        tableLayoutIcon.className = "sa-table-layout-button-icon";
        tableLayoutIcon.src = addon.self.dir + "/assets/table-layout.svg";
        tableLayoutIcon.draggable = false;

        const defaultLayoutIcon = document.createElement("img");
        defaultLayoutIcon.className = "sa-default-layout-button-icon";
        defaultLayoutIcon.src = addon.self.dir + "/assets/default-layout.svg";
        defaultLayoutIcon.draggable = false;

        tableLayout.appendChild(tableLayoutIcon);
        defaultLayout.appendChild(defaultLayoutIcon);
        row.appendChild(tableLayout);
        row.appendChild(defaultLayout)

        costumeListArea.before(row);
    }
};