webix.ready(function() {

  const popupWindow = webix.ui(popupConfig);

  const buttonConfig = {
    view: "button",
    id: "btnToolbar",
    css: "add_button",
    type: "icon",
    icon: "wxi-plus",
    label: "Add offer to compare",
    autowidth: true,
    click: () => {
      popupWindow.show();
    }
  };

  const app = webix.ui({
    padding: 60,
    cols: [
      {},
      {
        rows: [
          {},
          {
            view:"scrollview",
            scroll: "x",
            width: 400,
            body: {
              view:"dataview",
              id: "dataviewData",
              yCount: 1,
              type: {
                height: 150,
                width: 200
              },
              template: (obj) => {
                return `
                  <div style="font-weight: bold; text-align: center">
                    <span>${obj.name}</span>
                    <span class='mdi mdi-trash-can-outline'></span>
                  </div>
                  <div style="text-align: center">${obj.value}</div>
                  <div style="text-align: center">${obj.addedValue}</div>
                  <div style="text-align: center">${obj.value + obj.addedValue}</div>
                  <div style="font-weight: bold; text-align: center">Price(per, final)</div>
                `;
              },
              onClick: {
                "mdi-trash-can-outline": (e, id) => {
                  $$("dataviewData").remove(id);
                  $$("dataviewData").define("xCount", $$("dataviewData").config.xCount - 1);
                  $$("dataviewData").resize();
                  $$("popupDatatable").updateItem(id, {checked: 0});
                }
              }
            },
          },
          {}
        ]
      },
      {width: 10},
      {
        rows: [
          {},
          buttonConfig,
          {}
        ]
      },
      {}
    ]
  });

  webix.extend(app, webix.ProgressBar);
});
