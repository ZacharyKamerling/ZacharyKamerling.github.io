﻿class Unit {
    sprite_graphics: SpriteGraphic[] = new Array();
    weapons: SpriteGraphic[] = new Array();
    build_roster: string[] = new Array();
    train_roster: string[] = new Array();
    command_roster: string[] = new Array();
    passengers: number[] = new Array();

    // ORDER QUEUES
    train_queue: Interaction.TrainOrder.Training[] = new Array();

    name: string;
    is_structure: boolean;
    icon_src: string;
    tooltip: string;
    id: number;
    type_id: number;
    anim_id: number;
    team: number;
    x: number;
    y: number;
    width_and_height: { w: number, h: number };
    height: number;
    facing: number;
    health: number;
    progress: number;
    collision_radius: number;
    sight_range: number;
    train_rate: number;
    train_progress: number;

    frame_created: number;
    time_created: number;
    is_dead: boolean;
    is_selected: boolean;
    is_being_selected: boolean;
    capacity: number;

    clone(): Unit {
        let a = new Unit();

        for (let sg of this.sprite_graphics) {
            a.sprite_graphics.push(sg.clone());
        }

        for (let wpn of this.weapons) {
            a.weapons.push(wpn.clone());
        }

        a.passengers = this.passengers;
        a.build_roster = this.build_roster;
        a.command_roster = this.command_roster;
        a.train_roster = this.train_roster;
        a.name = this.name;
        a.is_structure = this.is_structure;
        a.icon_src = this.icon_src;
        a.tooltip = this.tooltip;
        a.type_id = this.type_id;
        a.id = this.id;
        a.anim_id = this.anim_id;
        a.team = this.team;
        a.x = this.x;
        a.y = this.y;
        a.width_and_height = this.width_and_height;
        a.facing = this.facing;
        a.health = this.health;
        a.progress = this.progress;
        a.collision_radius = this.collision_radius;
        a.sight_range = this.sight_range;
        a.train_rate = this.train_rate;
        a.train_progress = this.train_progress
        a.frame_created = this.frame_created;
        a.time_created = this.time_created;
        a.is_dead = this.is_dead;
        a.is_selected = this.is_selected;
        a.is_being_selected = this.is_being_selected;
        a.capacity = this.capacity;

        return a;
    }

    jsonConfig(str: string) {
        let o = JSON.parse(str);

        if (o.sprite_graphics) {
            for (let i = 0; i < o.sprite_graphics.length; i++) {
                this.sprite_graphics[i] = new SpriteGraphic();
                Object.assign(this.sprite_graphics[i], o.sprite_graphics[i]);
            }
        }

        if (o.weapons) {
            for (let wpn of o.weapons) {
                let tmp = new SpriteGraphic();
                Object.assign(tmp, wpn.sprite_graphic);
                this.weapons.push(tmp);
            }
        }

        if (o.build_roster) {
            for (let bld of o.build_roster) {
                this.build_roster.push(bld);
            }
        }

        if (o.train_roster) {
            for (let train of o.train_roster) {
                this.train_roster.push(train);
            }
        }

        if (o.command_roster) {
            for (let cmd of o.command_roster) {
                this.command_roster.push(cmd);
            }
        }

        this.name = o.name;
        this.icon_src = o.icon_src;
        this.is_structure = o.is_structure;
        this.tooltip = o.tooltip;
        this.width_and_height = o.width_and_height;
        this.collision_radius = o.collision_radius;
        this.sight_range = o.sight_range;
        this.train_rate = o.train_rate;
    }

    decode(c: Cereal, time: number, frame: number) {
        this.frame_created = frame;
        this.time_created = time;
        this.x = c.getU16() / 64 * Game.TILESIZE;
        this.y = c.getU16() / 64 * Game.TILESIZE;
        this.anim_id = c.getU8();
        this.team = c.getU8();
        this.facing = c.getU8() * 2 * Math.PI / 255;
        this.health = c.getU8();
        this.progress = c.getU8();

        for (let wpn of this.weapons) {
            wpn.facing = c.getU8() * 2 * Math.PI / 255;
        }

        if (this.capacity > 0) {
            this.passengers = new Array();
            let passengerCount = c.getU8();

            for (;passengerCount > 0; passengerCount--) {
                this.passengers.push(c.getU16());
            }
        }

        if (this.train_rate > 0) {
            this.train_progress = c.getU8();
        }
    }

    render(game: Game, layers: { x: number, y: number, ang: number, ref: string }[][]): void {
        let tc = game.teamColors[this.team];
        let sg = this.sprite_graphics;

        for (let sg of this.sprite_graphics) {
            let ang = Misc.normalizeAngle(this.facing + sg.facing);
            let xy = Misc.rotateAroundOrigin(this.x, this.y, this.x + sg.x_offset, this.y + sg.y_offset, ang);
            layers[sg.layer].push({ x: xy.x, y: xy.y, ang: ang, ref: tc.name + '/' + sg.img_ref});
        }

        for (let sg of this.weapons) {
            let xy = Misc.rotateAroundOrigin(this.x, this.y, this.x + sg.x_offset, this.y + sg.y_offset, this.facing);
            layers[sg.layer].push({ x: xy.x, y: xy.y, ang: sg.facing, ref: tc.name + '/' + sg.img_ref});
        }
    }

    renderMinimap(game: Game, layers: { x: number, y: number, ang: number, ref: string }[][]): void {
        let tc = game.teamColors[this.team];
        layers[1].push({ x: this.x, y: this.y, ang: this.facing, ref: tc.name + '/' + "img/minimap_unit.png"});
    }

    step(timeDelta: number, oldUnit: Unit, newUnit: Unit) {
        let f1 = oldUnit.facing;
        let f2 = newUnit.facing;
        let turn = Misc.angularDistance(f1, f2) * timeDelta;
        this.facing = Misc.turnTowards(this.facing, f2, turn);
        this.x = this.x + (newUnit.x - oldUnit.x) * timeDelta;
        this.y = this.y + (newUnit.y - oldUnit.y) * timeDelta;
        this.progress = newUnit.progress;
        this.health = newUnit.health;

        for (let sg of this.sprite_graphics) {
            sg.rotate(timeDelta);
        }

        for (let i = 0; i < this.weapons.length; i++) {
            f1 = oldUnit.weapons[i].facing;
            f2 = newUnit.weapons[i].facing;
            this.weapons[i].facing = Misc.turnTowards(this.weapons[i].facing, f2, Misc.angularDistance(f1, f2) * timeDelta);
        }
    }

    static decodeUnit(game: Game, data: Cereal, time: number, frame: number) {
        let typeID = data.getU8();
        let unitID = data.getU16();
        let soul = game.souls[unitID];

        if (soul && soul.current.type_id === typeID) {
            soul.old = soul.current.clone();
            soul.new.decode(data, time, frame);
        }
        else {
            let newUnit = game.unitPrototypes[typeID];
            if (newUnit) {
                newUnit = newUnit.clone();
                newUnit.decode(data, time, frame);
                newUnit.type_id = typeID;
                game.souls[unitID] = { new: newUnit, current: newUnit.clone(), old: null };
            }
        }
    }
}