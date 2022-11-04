"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpCities = void 0;
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const setUpCity_1 = require("@civ-clone/civ1-city/tests/lib/setUpCity");
const CityBuild_1 = require("@civ-clone/core-city-build/CityBuild");
const PlayerResearch_1 = require("@civ-clone/core-science/PlayerResearch");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const AvailableCityBuildItemsRegistry_1 = require("@civ-clone/core-city-build/AvailableCityBuildItemsRegistry");
const AdvanceRegistry_1 = require("@civ-clone/core-science/AdvanceRegistry");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const PlayerGovernment_1 = require("@civ-clone/core-government/PlayerGovernment");
const AvailableGovernmentRegistry_1 = require("@civ-clone/core-government/AvailableGovernmentRegistry");
const setUpCities = async (ruleRegistry = RuleRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, availableBuildItemsRegistry = AvailableCityBuildItemsRegistry_1.instance, advanceRegistry = AdvanceRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, availableGovernmentRegistry = AvailableGovernmentRegistry_1.instance) => {
    const city = await (0, setUpCity_1.setUpCity)({
        ruleRegistry,
        playerWorldRegistry,
    }), friendlyCity = await (0, setUpCity_1.setUpCity)({
        ruleRegistry,
        playerWorldRegistry,
        player: city.player(),
        tile: city.tile().getNeighbour('e'),
        world: city.tile().map(),
    }), enemyCity = await (0, setUpCity_1.setUpCity)({
        ruleRegistry,
        playerWorldRegistry,
        tile: friendlyCity.tile().getNeighbour('e'),
        world: city.tile().map(),
    });
    cityBuildRegistry.register(new CityBuild_1.default(city, availableBuildItemsRegistry, ruleRegistry), new CityBuild_1.default(friendlyCity, availableBuildItemsRegistry, ruleRegistry), new CityBuild_1.default(enemyCity, availableBuildItemsRegistry, ruleRegistry));
    playerResearchRegistry.register(new PlayerResearch_1.default(city.player(), advanceRegistry, ruleRegistry), new PlayerResearch_1.default(enemyCity.player(), advanceRegistry, ruleRegistry));
    playerGovernmentRegistry.register(new PlayerGovernment_1.default(city.player(), availableGovernmentRegistry, ruleRegistry), new PlayerGovernment_1.default(enemyCity.player(), availableGovernmentRegistry, ruleRegistry));
    return [city, friendlyCity, enemyCity];
};
exports.setUpCities = setUpCities;
exports.default = exports.setUpCities;
//# sourceMappingURL=setUpCities.js.map