module.exports = {

  // Cache from db
  data: {},

  loadStpStats: async function() {
    sails.log("Loading STP Stats...");
    let stpStats = await StpStats.find({});
    sails.log("Total STP Stats: " + stpStats.length);
    if (stpStats.length == 0) {
      // Create new STP stats
      sails.log("Creating new STP Stats...");
      let newStp = await StpStats.create({});
      stpStats = [newStp];
    } else if (stpStats.length > 1) {
      sails.log.warn("Multiple StpStats records are found");
    }

    StpStatsUtils.data = stpStats[0];
    sails.log("Loaded STP Stats", StpStatsUtils.data);
    // 2019-07-19T16:44:42+07:00 debug: Loaded STP Stats {"shopinfoLastId":0,"createdAt":"2019-07-19T09:38:09.852Z","updatedAt":"2019-07-19T09:38:09.852Z","id":3}
  },

  updateStpStats: function(newStats) {
    sails.log("Updating STP Stats: ", newStats);

    StpStats.update(
      { id: StpStatsUtils.data.id },
      {
        shopinfoLastId: (newStats.shopinfoLastId && newStats.shopinfoLastId > StpStatsUtils.data.shopinfoLastId) ? newStats.shopinfoLastId : StpStatsUtils.data.shopinfoLastId,
        // menuLastId: 
        // activityLastId: 
      }
    ).exec(function(err, updatedStats) {
      if (err) { return sails.log.error("Could not update STP Stats: " + err); }
      if (updatedStats.length === 0) { return sails.log.error("No STP Stats is updated"); }
      StpStatsUtils.data = updatedStats[0];
      sails.log("Updated STP Stats: ", StpStatsUtils.data);
    });
  },

  dailyStatsSync: function() {
    // TODO: should use api get-my-shopinfo ? --> YES for creation only, it's better to check StpStatsUtils.data.shopinfoLastId
    if (!StpStatsUtils.data.shopinfoLastId) {
      // ShopInfo has never been synced
      ShopInfo.find({}).exec(function(err, ashop) {
        if (err) return sails.log("Error on getting shopinfo " + err);
        
        for (let i = 0; i < ashop.length; i++) {
          if (i > 0) {
            sails.log.error("Multiple shopinfo has been found!!!\n", ashop[i]);
            continue;
          }
          PublicServerUtils.sendNewShopInfo(ashop[i]);
        }
      });
    }
  },
};