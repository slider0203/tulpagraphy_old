/* File Created: June 18, 2012 hello moto*/
tg.factories.mapEntityFactory =
    (function(ko, _, $, tg) {
        var terrains;
        var embellishments;

        function _getTerrains() {
            return new MapContext().getTerrains();
        };

        function _getEmbellishments() {
            return new MapContext().getEmbellishments();
        };

        function MapViewModel(data) {
            var self = this;

            if (data) {
                data.width = { };
                data.height = { };

                data.width.pixelSize = +(_.max(data.tiles, function(tile) { return tile.x; }).x) + +data.tileDiameter;
                data.height.pixelSize = +(_.max(data.tiles, function(tile) { return tile.y; }).y) + +data.tileDiameter;

                data.width.tileCount = parseInt((+data.width.pixelSize / (.75 * +data.tileDiameter)) - (.25 / .75));
                data.height.tileCount = parseInt((+data.height.pixelSize / +data.tileDiameter) - .5);
            }

            self.id = ko.observable(data.id);
            self.name = ko.observable(data.name);
            self.width = ko.observable(data.width);
            self.width().tileCount = ko.observable(self.width().tileCount);
            self.width().pixelSize = ko.observable(self.width().pixelSize);
            self.height = ko.observable(data.height);
            self.height().tileCount = ko.observable(self.height().tileCount);
            self.height().pixelSize = ko.observable(self.height().pixelSize);
            self.tileDiameter = ko.observable(data.tileDiameter);
            self.tileTerrainChanged = ko.observable();
            self.tileEmbellishmentChanged = ko.observable();

            self.pointsString = ko.computed(function() {
                var points = [{ x: 0, y: .5 }, { x: .25, y: 0 }, { x: .5, y: 0 }, { x: .75, y: 0 }, { x: 1, y: .5 }, { x: .75, y: 1 }, { x: .5, y: 1 }, { x: .25, y: 1 }];
                points = _.map(points, function(point) { return { x: point.x * +self.tileDiameter(), y: point.y * +self.tileDiameter() }; });

                return _.reduce(points, function(memo, point) { return memo + point.x.toString() + ',' + point.y.toString() + ' '; }, '');
            });

            if (data.tiles) {
                var points = self.getHexPointsForTile(self.tileDiameter());
                data.tiles = _.map(data.tiles, function(tileData) { return self.reconstructTile(tileData, points); });
                data.tiles = _.sortBy(data.tiles, function(tile) { return (+tile.xIndex * self.width().pixelSize()) + +tile.yIndex; });

                self.tiles = ko.observableArray(data.tiles);
            }
        };

        MapViewModel.prototype = {
            getTileByCoordinates: function(x, y) {
                var self = this;

                var index = self._getIndexByIndexedCoordinates(x, y);

                if (index !== undefined && index !== null) {
                    return self.tiles()[index];
                }
            },

            getTilePointsString: function() {
                var self = this;
                var pointsString = '';

                var points = self.getHexPointsForTile(self.tileDiameter());

                for (var pointIndex in points) {
                    pointsString += points[pointIndex].x.toString() + ',' + points[pointIndex].y.toString() + ' ';
                }

                return pointsString;
            },

            // Public method for getting the points, meant to mask whether tiles are hexes or squares later on
            getPointsForTile: function(tileDiameter) {
                return this.getHexPointsForTile(tileDiameter);
            },

            getHexPointsForTile: function(tileDiameter) {
                var self = this;
                var points = [];

                var segments = [0, .5, .25, 0, .5, 0, .75, 0, 1, .5, .75, 1, .5, 1, .25, 1];

                for (var segmentIndex in segments) {
                    segments[segmentIndex] = segments[segmentIndex] * tileDiameter;
                }

                for (var segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 2) {
                    points.push({ x: segments[segmentIndex], y: segments[segmentIndex + 1] });
                }

                return points;
            },

            reconstructTile: function(tileData, points) {
                var self = this;

                if (tileData.terrainId !== undefined && tileData.terrainId !== null) {
                    tileData.terrain = self._getTerrainById(tileData.terrainId);
                }

                if (tileData.embellishmentId !== undefined && tileData.embellishmentId !== null) {
                    tileData.embellishment = self._getEmbellishmentById(tileData.embellishmentId);
                }

                if (!tileData.terrain) {
                    tileData.terrain = _getTerrains[0];
                }

                tileData.xIndex = tileData.x / (.75 * self.tileDiameter());
                tileData.yIndex = parseInt(tileData.y / self.tileDiameter());
                tileData.points = points;

                return new TileViewModel(tileData, self);
            },

            getSurroundingTilesForTile: function(tile) {
                var self = this;
                var surroundingTiles = [];

                for (var i = 1; i < 7; i++) {
                    var direction = self._calculateNeighboringTileDirection(i);
                    var x = self._calculateNeighboringTileX(i, tile, tile.diameter());
                    var y = self._calculateNeighboringTileY(i, tile, tile.diameter());
                    var otherTile = self.getTileByCoordinates(x, y);
                    var oppositeI = ((i + 3) % 6) + 1;

                    if (otherTile) {
                        surroundingTiles.push({
                            i: i,
                            model: otherTile,
                            direction: direction,
                            opposite: function() {
                                return surroundingTiles[oppositeI];
                            }
                        });
                    }
                }

                return surroundingTiles;
            },

            convertToData: function() {
                var self = this;
                var data = { };

                data.id = self.id();
                data.name = self.name();
                data.tileDiameter = self.tileDiameter();

                data.tiles = _.map(self.tiles(), function(tile) { return self.convertTileToData(tile); });

                return data;
            },

            convertTileToData: function(tile) {
                var self = this;
                var data = { };
                data.x = tile.x();
                data.y = tile.y();
                data.terrainId = tile.terrain() == null ? null : tile.terrain().id;
                data.embellishmentId = tile.embellishment() ? tile.embellishment().id() : null;

                return data;
            },

            changeTileTerrain: function(tile, terrain) {
                tile.terrain(terrain);

                this.tileTerrainChanged(tile);
            },

            changeTileEmbellishment: function(tile, embellishment) {
                tile.embellishment(embellishment);

                this.tileEmbellishmentChanged(tile);
            },

            _calculateNeighboringTileX: function(i, tile, d) {
                var self = this,
                    adjustment,
                    xi;

                switch (i) {
                case 3:
                case 5:
                    adjustment = 1;
                    break;
                case 1:
                case 6:
                    adjustment = 0;
                    break;
                case 2:
                case 4:
                    adjustment = -1;
                    break;
                }

                xi = tile.xIndex + adjustment;

                if ((xi < 0) || (xi >= self.width().tileCount())) {
                    xi = null;
                }

                return xi;
            },

            _calculateNeighboringTileY: function(i, tile, d) {
                var self = this,
                    adjustment,
                    yi,
                    isOddRow;

                isOddRow = ((tile.xIndex) % 2);
                switch (i) {
                case 1:
                    adjustment = -1;
                    break;
                case 2:
                case 3:
                    adjustment = isOddRow ? 0 : -1;
                    break;
                case 4:
                case 5:
                    adjustment = isOddRow ? 1 : 0;
                    break;
                case 6:
                    adjustment = 1;
                    break;
                default:
                    break;
                }

                yi = tile.yIndex + adjustment;

                if ((yi < 0) || (yi >= self.height().tileCount())) {
                    yi = null;
                }

                return yi;
            },

            _calculateNeighboringTileDirection: function(i) {
                var direction;
                switch (i) {
                case 1:
                    direction = 90;
                    break;
                case 2:
                    direction = 150;
                    break;
                case 3:
                    direction = 30;
                    break;
                case 4:
                    direction = 210;
                    break;
                case 5:
                    direction = 330;
                    break;
                case 6:
                    direction = 270;
                    break;
                }

                return direction;
            },

            _getTerrainById: function(terrainId) {
                var foundTerrain = _.find(_getTerrains(),
                    function(t) {
                        return t.id === terrainId;
                    });

                return foundTerrain ? foundTerrain : _getTerrains()[0];
            },

            _getEmbellishmentById: function(embellishmentId) {
                return _.find(_getEmbellishments(), function(embellishment) { return embellishment.id() == embellishmentId; });
            },

            _indexTiles: function() {
                var self = this,
                    index = undefined;

                self._indexedTiles = { };

                _.each(self.tiles(), function(tile) {
                    index = self._getIndexForTile(tile);
                    self._indexedTiles[index] = tile;
                });
            },

            _getIndexForTile: function(tile) {
                return this._getIndexByCartesianCoordinates(tile.x(), tile.y());
            },

            _getIndexByIndexedCoordinates: function(x, y) {
                return (x !== null && x !== undefined && y !== null && y !== undefined) ? (x * this.height().tileCount() + y) : null;
            },

            _getIndexByCartesianCoordinates: function(x, y) {
                return x + '|' + y;
            }
        };

        function TileViewModel(data, mapViewModel) {
            var self = this;

            self.mapViewModel = mapViewModel;
            self._x = data.x;
            self._y = data.y;
            self.xIndex = data.xIndex;
            self.yIndex = data.yIndex;
            self.terrain = ko.observable(data.terrain ? data.terrain : _getTerrains()[0]);
            self.embellishment = ko.observable(data.embellishment);
            self.observers = { };
            self.points = data.points;
            self.layerData = { };
        };

        TileViewModel.prototype = {
            x: function() {
                return this._x;
            },

            y: function() {
                return this._y;
            },

            diameter: function() {
                return this.mapViewModel.tileDiameter();
            },

            zIndex: function() {
                return this.terrain() ? this.terrain().baseZIndex : 0;
            },

            surroundingTiles: function() {
                if (!this._surroundingTiles) {
                    this._surroundingTiles = this.mapViewModel.getSurroundingTilesForTile(this);
                }

                return this._surroundingTiles;
            }
        };

        function MapBackgroundLayer(mapViewModel, backgroundCanvas) {
            var self = this;

            self.mapViewModel = mapViewModel;
            self.canvas = backgroundCanvas;

            for (var tileIndex in mapViewModel.tiles()) {
                var tile = mapViewModel.tiles()[tileIndex];

                tile.layerData.background = { };
                tile.layerData.background.overlayImageSubscriptions = [];

                self.drawTile(tile);
            }

            mapViewModel.tileTerrainChanged.subscribe(function(tile) { self.handleTerrainChanged(tile, tile.terrain()); });
        };

        MapBackgroundLayer.prototype = {
            drawTile: function(tile) {
                var self = this;

                self.drawTerrainForTile(tile);
                self.blendTile(tile);
            },

            drawTerrainForTile: function(tile) {
                var self = this;
                var imageNumber = (tile.x() + tile.y()) % tile.terrain().images.length;
                if (tile.terrain().images[imageNumber].loaded()) {
                    var context = self.canvas.getContext('2d');
                    context.drawImage(tile.terrain().images[imageNumber].element, tile.x(), tile.y(), tile.diameter(), tile.diameter());
                } else {
                    tile.layerData.background.terrainLoadedSubscription =
                        tile.terrain().images[imageNumber].loaded.subscribe(function() { self.handleTerrainLoaded(tile); });
                }
            },

            blendTile: function(tile) {
                var self = this;
                var tilesToBlend = _.filter(tile.surroundingTiles(), function(surroundingTile) { return surroundingTile.model.zIndex() > tile.zIndex(); });

                for (var tileIndex in tilesToBlend) {
                    var surroundingTile = tilesToBlend[tileIndex];
                    var image = surroundingTile.model.terrain().getOverlayImage(surroundingTile.direction);

                    if (image.loaded()) {
                        self.drawOverlay(tile, surroundingTile);
                    } else {
                        var sub = { };
                        sub.subscription =
                            image.loaded.subscribe(function() { self.handleOverlayImageLoad(tile, surroundingTile, sub); });
                    }
                }
            },

            drawOverlay: function(tile, surroundingTile) {
                // Assumes we already have a loaded overlay image
                var self = this;
                var image = surroundingTile.model.terrain().getOverlayImage(surroundingTile.direction);
                var radius = +tile.diameter() * .5;
                var context = self.canvas.getContext('2d');

                context.save();

                //Remove translation and rotation to use one image per direction (maybe one image all around and clipped later.
                context.translate(tile.x() + radius, tile.y() + radius);
                //context.rotate((+surroundingTile.direction) * -(Math.PI / 180));

                context.drawImage(image.element, -radius, -radius, tile.diameter(), tile.diameter());

                context.restore();
            },

            handleOverlayImageLoad: function(tile, surroundingTile, sub) {
                var self = this;

                self.drawTile(tile);
                self.unsubscribe(sub.subscription);
            },

            handleSurroundingTileTerrainChanged: function(tile, surroundingTile) {
                var self = this;

                self.drawTile(tile);
            },

            handleTerrainChanged: function(tile, newTerrain) {
                var self = this;

                self.drawTile(tile);

                for (var tileIndex in tile.surroundingTiles()) {
                    var surroundingTile = tile.surroundingTiles()[tileIndex];

                    self.drawTile(surroundingTile.model);
                }
            },

            handleTerrainLoaded: function(tile) {
                var self = this;

                self.unsubscribeFromTerrainLoaded(tile);
                self.drawTile(tile);
            },

            unsubscribeFromTerrainLoaded: function(tile) {
                if (tile.layerData.background.terrainLoadedSubscription) {
                    tile.layerData.background.terrainLoadedSubscription.dispose();
                    tile.layerData.background.terrainLoadedSubscription = null;
                }
            },

            unsubscribe: function(sub) {
                if (sub) {
                    sub.dispose();
                }
            }
        };

        function MapEmbellishmentLayer(mapViewModel, embellishmentCanvas) {
            var self = this;
            var tile;

            self.mapViewModel = mapViewModel;
            self.canvas = embellishmentCanvas;

            for (var tileIndex in self.mapViewModel.tiles()) {
                tile = self.mapViewModel.tiles()[tileIndex];

                self.initializeTile(tile);
            }

            self.mapViewModel.tileEmbellishmentChanged.subscribe(function(tile) { self.handleTileEmbellishmentChanged(tile); });

            _.each(self.mapViewModel.tiles(), function(tile) { self.refreshTile(tile); });
        };

        MapEmbellishmentLayer.prototype = {
            initializeTile: function(tile) {
                var self = this;

                self.initializeLayerForTile(tile);
            },

            initializeLayerForTile: function(tile) {
                tile.layerData.embellishment = { };
            },

            drawTile: function(tile, context) {
                var self = this;

                if (tile && tile.embellishment() && tile.embellishment().images && tile.embellishment().images.length) {
                    //Creating a repeatable 'random'
                    var imageNumber = Math.floor((tile.x() + tile.y()) / 17) % tile.embellishment().images.length;
                    if (!tile.embellishment().images[imageNumber].loaded()) {
                        tile.layerData.embellishment.imageLoadedSubscription =
                            tile.embellishment().images[imageNumber].loaded.subscribe(function() {
                                self.handleEmbellishmentImageLoaded(this);
                            }, tile);
                    } else {
                        context = context == null ? self.canvas.getContext('2d') : context;

                        //TODO: Replace hard coded 192 with tile size
                        context.drawImage(tile.embellishment().images[imageNumber].element,
                            tile.x() - ((tile.embellishment().images[imageNumber].element.width - 192) / 2),
                            tile.y() - ((tile.embellishment().images[imageNumber].element.height - 192) / 2),
                            tile.embellishment().images[imageNumber].element.width,
                            tile.embellishment().images[imageNumber].element.height);
                    }
                }
            },

            clearTile: function(tile, context) {
                context.clearRect(tile.x(), tile.y(), tile.diameter(), tile.diameter());
            },

            clipContextToTile: function(context, tile) {
                context.moveTo(tile.x() + tile.points[tile.points.length - 1].x, tile.y() + tile.points[tile.points.length - 1].y);

                context.beginPath();

                _.each(tile.points, function(point) {
                    context.lineTo(tile.x() + point.x, tile.y() + point.y);
                });

                context.closePath();

                context.clip();
            },

            refreshTile: function(tile) {
                var self = this;

                var context = self.canvas.getContext('2d');
                context.save();

                self.clipContextToTile(context, tile);
                self.clearTile(tile, context);

                _.each(tile.surroundingTiles().slice(0, 3), function(neighboringTile) {
                    self.drawTile(neighboringTile.model, context);
                });

                self.drawTile(tile, context);

                _.each(tile.surroundingTiles().slice(3), function(neighboringTile) {
                    self.drawTile(neighboringTile.model, context);
                });

                context.restore();
            },

            handleTileEmbellishmentChanged: function(tile) {
                var self = this;

                self.unsubscribeFromEmbellishmentImageLoaded(tile);

                self.refreshTile(tile);

                _.each(tile.surroundingTiles(), function(neighboringTile) {
                    self.handleNeighboringTileEmbellishmentChanged(neighboringTile.model);
                });
            },

            handleNeighboringTileEmbellishmentChanged: function(tile) {
                var self = this;

                self.refreshTile(tile);
            },

            handleEmbellishmentImageLoaded: function(tile) {
                var self = this;
                self.unsubscribeFromEmbellishmentImageLoaded(tile);
                self.drawTile(tile);
            },

            unsubscribeFromEmbellishmentImageLoaded: function(tile) {
                if (tile.layerData.embellishment.imageLoadedSubscription) {
                    tile.layerData.embellishment.imageLoadedSubscription.dispose();
                    delete tile.layerData.embellishment.imageLoadedSubscription;
                }
            }
        };

        function Embellishment(id, name, imageDirectory, zIndex, number) {
            var self = this;

            self.id = ko.observable(id);
            self.name = ko.observable(name);
            self.imageDirectory = ko.observable(imageDirectory);
            self.zIndex = ko.observable(zIndex);
            self.images = [];
            for (var i = 1; i <= number; i++) {
                self.images.push(new MapImage(imageDirectory + i + '.png'));
            }
        };

        function Terrain(id, name, fill, imageDirectory, zIndex, number) {
            var self = this;

            self.id = id;
            self.name = name;
            self.fill = fill;
            self.imageDirectory = imageDirectory;
            self.baseZIndex = zIndex;
            self.northOverlayImage = new MapImage(imageDirectory + 'overlay-medium-n.png');
            self.northEastOverlayImage = new MapImage(imageDirectory + 'overlay-medium-ne.png');
            self.northWestOverlayImage = new MapImage(imageDirectory + 'overlay-medium-nw.png');
            self.southOverlayImage = new MapImage(imageDirectory + 'overlay-medium-s.png');
            self.southEastOverlayImage = new MapImage(imageDirectory + 'overlay-medium-se.png');
            self.southWestOverlayImage = new MapImage(imageDirectory + 'overlay-medium-sw.png');
            self.images = [];

            for (var i = 1; i <= number; i++) {
                self.images.push(new MapImage(imageDirectory + i + '.png'));
            }
        };

        Terrain.prototype = {
            getOverlayImage: function (direction) {
                var self = this;

                var image;
                switch (direction) {
                    case 90:
                        image = self.southOverlayImage;
                        break;
                    case 150:
                        image = self.southEastOverlayImage;
                        break;
                    case 30:
                        image = self.southWestOverlayImage;
                        break;
                    case 210:
                        image = self.northEastOverlayImage;
                        break;
                    case 330:
                        image = self.northWestOverlayImage;
                        break;
                    case 270:
                        image = self.northOverlayImage;
                        break;
                }

                //TODO: Get one image for each direction

//                var image;
//                direction = direction % 360;
//                direction = (direction / 60) | 0;
//                direction = direction % 3;

//                switch (direction) {
//                case 0:
//                    image = self.northEastOverlayImage;
//                    break;
//                case 1:
//                    image = self.northOverlayImage;
//                    break;
//                case 2:
//                    image = self.northWestOverlayImage;
//                    break;
//                }

                return image;
            }
        };

        function MapImage(url) {
            var self = this;

            self.loaded = ko.observable(false);
            self.element = new Image();
            self.element.src = url;

            var onLoaded = function() { self.loaded(true); };

            self.element.addEventListener('load', onLoaded);
        };

        function MapContext() {
        };

        MapContext.prototype = {
            clearMaps: function() {
                delete localStorage.maps;
            },

            deleteMap: function(value) {
                var id;

                // 0 or '0' are valid ids
                if (value === null || value === undefined) {
                    id = null;
                } else if (_.isObject(value) && value.id) {
                    if (_.isFunction(value.id)) {
                        id = value.id().toString();
                    } else {
                        id = value.id.toString();
                    }
                } else {
                    id = value.toString();
                }

                tg.log('Deleting map with an id of: ' + id === null || id === undefined ? 'NULL!' : id.toString());

                var maps = this.getMaps();
                var index = _.indexOf(maps, _.find(maps, function(map) { return map.id == id; }));

                if (index !== null && index !== undefined) {
                    maps.splice(index, 1);
                    this._saveMaps(maps);
                }

                return index !== null && index !== undefined;
            },

            getMaps: function() {
                var self = this;
                var maps = JSON.parse(localStorage.getItem('maps'));

                maps = maps ? maps : [];

                maps = _.map(maps, function(map) {
                    return self._expandMap(map);
                });

                return maps;
            },

            getMapById: function(mapId) {
                return _.find(this.getMaps(), function(m) {
                    return m.id === mapId;
                });
            },

            saveMap: function(map) {
                var self = this;

                if (!map.id) {
                    map.id = this.getNextMapId();
                }

                var maps = this.getMaps();

                var foundMap = _.find(maps, function(m) { return m.id == map.id; });

                if (foundMap) {
                    maps[_.indexOf(maps, foundMap)] = map;
                } else {
                    maps.push(map);
                }

                maps = _.map(maps, function(map) {
                    return self._collapseMap(map);
                });

                self._saveMaps(maps);

                return map;
            },

            getNextMapId: function() {
                var maps = this.getMaps();

                var lastItem = _.max(maps, function(m) { return m.id; });
                var currentId = lastItem ? lastItem.id : 0;

                return +currentId + 1;
            },

            getVersion: function() {
                return localStorage.version;
            },

            setVersion: function(version) {
                if (!version)
                    delete localStorage.version;
                else {
                    localStorage.version = version;
                }
            },

            getTerrains: function() {
                if (!terrains || !terrains.length) {
                    this._initializeTerrains();
                }

                return terrains;
            },

            getEmbellishments: function() {
                if (!embellishments || !embellishments.length) {
                    this._initializeEmbellishments();
                }

                return embellishments;
            },

            _expandMap: function(data) {
                var self = this;
                var map = { };

                for (var i in data) {
                    if (i == 'tiles') {
                        map[i] = _.map(data[i], function(tile) {
                            return self._expandTile(tile);
                        });
                    } else {
                        map[i] = data[i];
                    }
                }

                return map;
            },

            _expandTile: function(tileData) {
                var tile = { };
                tileData = tileData.split('|');

                tile.x = +tileData[0];
                tile.y = +tileData[1];
                tile.terrainId = tileData[2];
                tile.embellishmentId = tileData[3];

                return tile;
            },

            _collapseMap: function(map) {
                var self = this;
                var data = { };

                for (var i in map) {
                    if (i == 'tiles') {
                        data[i] = _.map(map.tiles, function(tile) {
                            return self._collapseTileStructure(tile);
                        });
                    } else {
                        data[i] = map[i];
                    }
                }

                return data;
            },

            _collapseTileStructure: function(tile) {
                return tile.x.toString() + '|' + tile.y.toString() + '|' + tile.terrainId.toString() + '|' + (tile.embellishmentId ? tile.embellishmentId : '').toString();
            },

            _initializeTerrains: function() {
                terrains = [
				//Water and Beach
                    new Terrain('ocean', 'Ocean', 'blue', '/Content/Images/Terrain/Ocean/', 150, 1),
                    new Terrain('coast', 'Coast', 'lightblue', '/Content/Images/Terrain/Coast/', 100, 1),
                    new Terrain('beach', 'Beach', 'yellow', '/Content/Images/Terrain/Beach/', 150, 8),
				//Dirt
                    new Terrain('drydirt', 'Dry Dirt', 'brown', '/Content/Images/Terrain/Dirt/Dry/', 300, 7),
                    new Terrain('dirt', 'Dirt', 'brown', '/Content/Images/Terrain/Dirt/', 250, 1),
                    new Terrain('wetdirt', 'Wet Dirt', 'brown', '/Content/Images/Terrain/Dirt/Wet/', 200, 7),
				//Road
                    new Terrain('mossyroad', 'Mossy Road', 'brown', '/Content/Images/Terrain/Road/Mossy/', 550, 2),
                    new Terrain('road', 'Road', 'gray', '/Content/Images/Terrain/Road/', 550, 4),
                    new Terrain('cleanroad', 'Clean Road', 'gray', '/Content/Images/Terrain/Road/Clean/', 500, 3),
				//Grass
                    new Terrain('grass', 'Grass', 'green', '/Content/Images/Terrain/Grass/', 700, 8),
                    new Terrain('simidrygrass', 'Simi-Dry Grass', 'green', '/Content/Images/Terrain/Grass/Simi-Dry/', 750, 6),
                    new Terrain('drygrass', 'Dry Grass', 'green', '/Content/Images/Terrain/Grass/Dry/', 650, 6),
                    new Terrain('leaves', 'Fallen Leaves', 'green', '/Content/Images/Terrain/Grass/Leaf-Litter/', 600, 6),
				//Hills
                    new Terrain('hills', 'Hills', 'green', '/Content/Images/Terrain/Hills/', 800, 3),
                    new Terrain('deserthills', 'Desert Hills', 'yellow', '/Content/Images/Terrain/Hills/Desert/', 850, 3),
                    new Terrain('dryhills', 'Dry Hills', 'yellow', '/Content/Images/Terrain/Hills/Dry/', 900, 3),
                    new Terrain('snowhills', 'Snowy Hills', 'gray', '/Content/Images/Terrain/Hills/Snow/', 950, 3),
                    new Terrain('desert', 'Desert', 'yellow', '/Content/Images/Terrain/Desert/', 500, 8)
                ];
            },

            _initializeEmbellishments: function() {
                embellishments = [
                    new Embellishment('', 'Clear', '/Content/Images/Embellishments/Clear/', 500, 1),
                    new Embellishment('forest', 'Deciduous Forest', '/Content/Images/Embellishments/Forest/Deciduous/', 500, 4),
                    new Embellishment('densetropic', 'Dense Tropical', '/Content/Images/Embellishments/Forest/Tropical-Dense/', 500, 9),
                    new Embellishment('mediumtropic', 'Medium Tropical', '/Content/Images/Embellishments/Forest/Tropical-Medium/', 500, 6),
                    new Embellishment('sparsetropic', 'Sparse Tropical', '/Content/Images/Embellishments/Forest/Tropical-Sparse/', 500, 9),
                    new Embellishment('palm', 'Palms', '/Content/Images/Embellishments/Forest/Palm/', 500, 6),
                    new Embellishment('reef', 'Ocean Reef', '/Content/Images/Embellishments/Ocean/Reef/', 500, 4),
                    new Embellishment('rock', 'Rocks', '/Content/Images/Embellishments/Rocks/', 500, 14),
                    new Embellishment('pinetree', 'Pine Tree', '/Content/Images/Embellishments/Encounter/Pine Tree/', 500, 3),
                    new Embellishment('tree', 'Tree', '/Content/Images/Embellishments/Encounter/Tree/', 500, 7),
                    new Embellishment('ewwall', 'E-W Wall', '/Content/Images/Embellishments/Wall/Full/E-W/', 200, 1),
                    new Embellishment('ewwall2', 'E-W Wall 2', '/Content/Images/Embellishments/Wall/Full/E-W2/', 200, 1),
                    new Embellishment('nswall', 'N-S Wall', '/Content/Images/Embellishments/Wall/Full/N-S/', 200, 1),
                    new Embellishment('neswwall', 'NE-SW Wall', '/Content/Images/Embellishments/Wall/Full/NE-SW/', 200, 1),
                    new Embellishment('nwsewall', 'NW-SE Wall', '/Content/Images/Embellishments/Wall/Full/NW-SE/', 200, 1),
                    new Embellishment('ewgap', 'E-W Gap', '/Content/Images/Embellishments/Wall/Gap/E-W/', 200, 1),
                    new Embellishment('ewgap2', 'E-W Gap 2', '/Content/Images/Embellishments/Wall/Gap/E-W2/', 200, 1),
                    new Embellishment('nsgap', 'N-S Gap', '/Content/Images/Embellishments/Wall/Gap/N-S/', 200, 1),
                    new Embellishment('neswgap', 'NE-SW Gap', '/Content/Images/Embellishments/Wall/Gap/NE-SW/', 200, 1),
                    new Embellishment('nwsegap', 'NW-SE Gap', '/Content/Images/Embellishments/Wall/Gap/NW-SE/', 200, 1),
                    new Embellishment('newall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/North-East/', 200, 1),
                    new Embellishment('sewall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/South-East/', 200, 1),
                    new Embellishment('swwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/South-West/', 200, 1),
                    new Embellishment('nwwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/North-West/', 200, 1),
                    new Embellishment('ewall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/East/', 200, 1),
                    new Embellishment('wwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/West/', 200, 1),
                    new Embellishment('nlwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/North-Lower/', 200, 1),
                    new Embellishment('nuwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/North-Upper/', 200, 1),
                    new Embellishment('slwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/South-Lower/', 200, 1),
                    new Embellishment('suwall', 'Wall', '/Content/Images/Embellishments/Wall/Segment/South-Upper/', 200, 1),
                ];
            },

            _saveMaps: function(maps) {
                localStorage.maps = JSON.stringify(maps);
            }
        };

        function MapFactory() {
        };
        
        MapFactory.prototype = {
            constructMapContext: function(options) {
                return new MapContext(options);
            },

            constructMapViewModel: function(id) {
                if (!id) {
                    throw { Message: 'No ID!' };
                }

                var context = this.constructMapContext();
                var map = context.getMapById(id);

                if (!map) {
                    throw { Message: 'Couldn\'t find any map with an ID of ' + id.toString() + '.' };
                }

                return new MapViewModel(map);
            },

            constructMapBackgroundLayer: function(mapViewModel, canvas) {
                return new MapBackgroundLayer(mapViewModel, canvas);
            },

            constructMapEmbellishmentLayer: function(mapViewModel, canvas) {
                return new MapEmbellishmentLayer(mapViewModel, canvas);
            }
        };

        return new MapFactory();
    })(ko, _, $, tg);