import * as _ from "lodash";
import { observable } from "mobx";
import { getEnv, getParent, process, types } from "mobx-state-tree";

import BottleApi from "../api/BottleApi";
import { Member } from "./MemberStore";

export const BottleNote = types.model("BottleBranch", {
    id: types.identifier(),
    member: types.reference(Member),
    rating: types.maybe(types.number),
    finish: types.maybe(types.number),
    fruity: types.maybe(types.number),
    vanilla: types.maybe(types.number),
    smokey: types.maybe(types.number),
    citrus: types.maybe(types.number),
    oily: types.maybe(types.number),
    peppery: types.maybe(types.number)
});

export const BottleRating = types.model("BottleRating", {
    id: types.identifier(),
    member: types.reference(Member),
    rating: types.number,
    thoughts: types.string
});

export const Bottle = types.model("Bottle", {
    id: types.identifier(),
    distillery: types.string,
    name: types.string,
    age: types.number,
    description: types.maybe(types.string)
    // bottleUrl: types.maybe(types.string),
    // distilleryUrl: types.maybe(types.string),
    // bottleImageUrl: types.maybe(types.string),
    // memberRatings: types.array(BottleRating),
    // notes: types.maybe(BottleNote),
    // memberNotes: types.maybe(types.array(BottleNote))
});

export const BottleStore = types
    .model("BottleStore", {
        bottles: types.optional(types.array(Bottle), []),
        isLoading: true
    })
    .actions((self) => {
        function markLoading(loading: boolean) {
            self.isLoading = loading;
        }

        function updateBottles(json: IBottle[]): void {
            json.forEach((bottle: IBottle) => {
                const index = _.findIndex(self.bottles, ["id", bottle.id]);

                if (index > 0) {
                    self.bottles.splice(index, 1, bottle);
                } else {
                    self.bottles.push(bottle);
                }
            });
        }

        const loadBottles = process(function* loadAllBottles() {
            const { bottleApi }: { bottleApi: BottleApi } = getEnv(self);

            const bottles = yield bottleApi.getAllBottles();
            updateBottles(bottles);
            markLoading(false);
        });

        return {
            loadBottles,
            updateBottles
        };
    });

export type IBottleNote = typeof BottleNote.Type;
export type IBottleRating = typeof BottleRating.Type;
export type IBottle = typeof Bottle.Type;
export type IBottleStore = typeof BottleStore.Type;
export default BottleStore;