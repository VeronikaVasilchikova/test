const popup = {
  view: "popup",
  width: 400,
  height: 400,
  body: {
    rows: [
      {
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
            id: "closeLabel",
            width: 60,
            label: "Close",
          },
        ],
      },
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
            width: 40
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
        data: []
      },
      {
        cols: [
          {},
          {
            view: "button",
            id: "addButton",
            label: "Add offer to compare",
            type: "icon",
            icon: "mdi mdi-download",
            autowidth: true,
          }
        ]
      },
    ]
  },
};

webix.protoUI(
  {
    name: "myComponent",
    defaults: {
      margin: 10,
      cols: [
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
              "mdi-trash-can-outline": function(e, id) {
                this.getTopParentView().removeChild(id);
              }
            }
          },
        },
        {
          view: "button",
          id: "buttonWithPopup",
          type: "icon",
          icon: "wxi-plus",
          label: "Add offer to compare",
          autowidth: true,
          click: function() {
            const popup = this.getParentView().getPopup();
            return popup.show(this.getParentView().getNode(), {
              pos: "left",
            });
          }
        },
      ],
    },
    $init(config) {
      this._popup = webix.ui(webix.copy(popup));
      const data = config.data;
      this.$$("popupDatatable").parse(data);

      this.$ready.push(() => {
        const addButton = this.getAddButton();
        const datatable = this.getDatatable();
        const closeLabel = this.getCloseLabel();

        addButton.attachEvent("onItemClick", (id, e) => {
          let checkedItem = Object.values(datatable.data.pull)
            .filter(item => item.checked === 1)
            .map(item => {
              let obj = {
                id: item.id,
                name: item.name,
                value: item.value,
                addedValue: item.addedValue,
                sum: item.value + item.addedValue
              };
              return obj;
            });
            this.addChild(checkedItem);
            this.closePopup();
        });

        closeLabel.attachEvent("onItemClick", (id, e) => {
          this.closePopup();
        });
      });
    },
    getPopup() {
      return this._popup || {};
    },
    getDatatable() {
      return this.$$("popupDatatable");
    },
    getAddButton() {
      return this.$$("addButton");
    },
    getCloseLabel() {
      return this.$$("closeLabel");
    },
    closePopup() {
      this.getPopup().hide();
    },
    addChild(item) {
      this.$$("dataviewData").clearAll();
      this.$$("dataviewData").parse(item);
      this.$$("dataviewData").define("xCount", item.length);
      this.$$("dataviewData").resize();
    },
    removeChild(id) {
      const companiesLayout = this.$$("dataviewData");
      companiesLayout.remove(id);
      companiesLayout.define("xCount", this.$$("dataviewData").config.xCount - 1);
      companiesLayout.resize();
      this.$$("popupDatatable").updateItem(id, {checked: 0});
    },
  },
  webix.IdSpace,
  webix.ui.layout
);
