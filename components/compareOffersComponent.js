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
            id: "closePopupLabel",
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
            header: {
              content: "masterCheckbox",
              contentId: "checkedAll",
            },
            template: "{common.checkbox()}",
            checkValue: 1,
            uncheckValue: 0,
            width: 40,
          },
          {
            id: "name",
            fillspace: true,
            header: "Company name",
          },
          {
            id: "value",
            header: "Offer",
            template: obj => `<span>${obj.value} (${obj.addedValue})</span>`,
          },
        ],
        data: []
      },
      {
        cols: [
          {},
          {
            view: "button",
            id: "addItemButton",
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
    name: "compareOffersComponent",
    defaults: {
      margin: 10,
      cols: [
        {
          view:"scrollview",
          scroll: "x",
          width: 400,
          body: {
            view:"dataview",
            id: "dataviewOffers",
            yCount: 1,
            type: {
              height: 150,
              width: 200
            },
            template: obj => `
                <div style="font-weight: bold; text-align: center">
                  <span>${obj.name}</span>
                  <span class='mdi mdi-trash-can-outline remove_item'></span>
                </div>
                <div style="text-align: center">${obj.value}</div>
                <div style="text-align: center">${obj.addedValue}</div>
                <div style="text-align: center">${obj.value + obj.addedValue}</div>
                <div style="font-weight: bold; text-align: center">Price(per, final)</div>
              `,
            onClick: {
              remove_item(e, id) {
                this.getTopParentView().removeItem(id);
              }
            }
          },
        },
        {
          view: "button",
          type: "icon",
          icon: "wxi-plus",
          label: "Add offer to compare",
          autowidth: true,
          click() {
            const parentView = this.getParentView();
            parentView.popup.show(parentView.getNode(), {
              pos: "left",
            });
          }
        },
      ],
    },
    $init(config) {
      this._popup = webix.ui(webix.copy(popup));
      const data = config.data || [];
      this.popupDatatable.parse(data);

      this.$ready.push(() => {
        this.addItemButton.attachEvent("onItemClick", (id, e) => {
          const popupDatatableData = this.popupDatatable.serialize(true);
          const markedItems = popupDatatableData.filter(item => item.checked === 1);
          this.addItem(markedItems);
          this.closePopup();
        });

        this.closePopupLabel.attachEvent("onItemClick", (id, e) => {
          this.closePopup();
        });
      });
    },
    get popup() {
      return this._popup || {};
    },
    get popupDatatable() {
      return this.$$("popupDatatable");
    },
    get addItemButton() {
      return this.$$("addItemButton");
    },
    get closePopupLabel() {
      return this.$$("closePopupLabel");
    },
    get dataviewOffers() {
      return this.$$("dataviewOffers");
    },
    closePopup() {
      this.popup.hide();
    },
    changeConfigurationOfView(view, property, value) {
      view.define(property, value);
      view.resize();
    },
    addItem(item) {
      const numOfCols = item.length;
      this.dataviewOffers.clearAll();
      this.dataviewOffers.parse(item);
      this.changeConfigurationOfView(this.dataviewOffers, "xCount", numOfCols);
    },
    removeItem(id) {
      const numOfCols = this.dataviewOffers.config.xCount - 1;
      const controlAllCheck = this.popupDatatable.getHeaderContent("checkedAll");
      this.dataviewOffers.remove(id);
      const data = webix.copy(this.popupDatatable.serialize(true))
        .map(item => Number(item.id) === Number(id) ? { ...item, checked: 0 } : item);
      this.changeConfigurationOfView(this.dataviewOffers, "xCount", numOfCols);
      if(controlAllCheck.isChecked()) {
        this.popupDatatable.getHeaderContent("checkedAll").uncheck();
        this.popupDatatable.clearAll();
        this.popupDatatable.parse(data);
      }
      else {
        this.popupDatatable.updateItem(id, {checked: 0});
      }
    },
  },
  webix.IdSpace,
  webix.ui.layout
);
