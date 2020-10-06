webix.ready(function() {

  const popupWindow = webix.ui(popupConfig);

  const collectOfCompanies = new webix.DataCollection({
    url: "data/companies.js"
  });

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

  const datatableConfig = {
    view: "datatable",
    id: "mainDatatable",
    scroll: "xy",
    data: collectOfCompanies,
    columns: [
      {
        id: "checked",
        header: "",
        template: "{common.checkbox()}",
        checkValue: 1,
        uncheckValue: 0,
        adjust: true
      },
      {
        id: "name",
        fillspace: true,
        header: "Company name",
      },
      {
        id: "value",
        header: "Offer",
      },
      {
        id: "addedValue",
        header: "Offer",
      },
    ],
  };

  webix.ui({
    padding: 60,
    cols: [
      {width: 200},
      datatableConfig,
      {width: 10},
      {
        rows: [
          {},
          buttonConfig,
          {}
        ]
      }
    ]
  });

});
