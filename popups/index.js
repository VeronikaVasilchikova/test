const collectOfCompanies = new webix.DataCollection({
  url: "data/companies.js"
});

const popupConfig = {
  view: "window",
  id: "window",
  borderless: true,
  modal: true,
  position: "center",
  width: 400,
  height: 400,
  head: {
    cols: [
      {
        width: 25,
      },
      {
        view: "label",
        label: "Offers to compare",
      },
      {
        view: "label",
        width: 60,
        label: "Close",
        click() {
          this.getTopParentView().hide();
        },
      },
    ],
  },
  body: {
    rows: [
      {
        view: "datatable",
        id: "popupDatatable",
        scroll: "xy",
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
            template: (obj) =>{
              return `
                <span>${obj.value} (${obj.addedValue})</span>
              `;
            }
          },
        ],
        data: collectOfCompanies,
      },
      {
        cols: [
          {},
          {
            view: "button",
            label: "Add offer to compare",
            type: "icon",
            icon: "mdi mdi-download",
            autowidth: true,
            click: () => {
              let checkedItem = Object.values($$("popupDatatable").data.pull)
                .filter(item => item.checked === 1);
              $$("window").hide();
            }
          }
        ]
      },
    ],
  },
  on: {

  },
};
