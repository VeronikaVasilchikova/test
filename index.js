webix.ready(function() {
  const app = webix.ui({
    padding: 60,
    cols: [
      {},
      {
        view: "compareOffersComponent",
        data: companiesData
      },
      {}
    ]
  });

  webix.extend(app, webix.ProgressBar);
});
