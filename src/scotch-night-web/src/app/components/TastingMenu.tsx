import { inject, observer } from "mobx-react";
import * as React from "react";
import { Button } from "reactstrap";

import { IRootStore } from "../stores/RootStore";

import * as format from "date-fns/format";

interface ITastingMenuProps { store: IRootStore; }

@inject("store")
@observer
export class TastingMenu extends React.Component<ITastingMenuProps> {
    constructor(props: ITastingMenuProps) {
        super(props);

        this._handleOnClick = this._handleOnClick.bind(this);
    }

    private _handleOnClick(bottle) {
        const { navigation, scotchNightStore } = this.props.store;

        scotchNightStore.setCurrentBottle(bottle);
        navigation.push(`/bottles/${bottle.id}`);
    }

    public render() {
        const { scotchNightStore } = this.props.store;
        const { bottles } = scotchNightStore.currentEvent;

        const menuList = bottles.map((item, index) => {
            return (
                <div className="card" key={index} onClick={() => this._handleOnClick(item)}>
                    <h3 className="card__head">{item.distillery}</h3>
                    <h4 className="card__subhead">{item.name}</h4>
                </div>
            );
        });

        return (
            <div>
                <h2 className="margin-vertical-md">Tasting Menu</h2>
                {
                    !bottles || bottles.length === 0 ? <div className="noBottles">No Bottles</div> : null
                }
                {menuList}
            </div>
        );
    }
}

export default TastingMenu;
