import { observer } from "mobx-react";
import * as React from "react";

import { IScotchNightStore } from "../stores/ScotchNightStore";

interface IHeaderProps { scotchNightStore: IScotchNightStore; }

export const Header = observer((props: IHeaderProps) => {
    const { currentUser } = props.scotchNightStore;

    let logInLink = (<a className="nav-link" href="#">Log In</a>);

    if (currentUser) {
        logInLink = (<a className="nav-link" href="#">{`${currentUser.firstName} ${currentUser.lastName}`}</a>);
    }

    return (<header className="navbar navbar-expand-sm">
        <a className="navbar-brand" href="#">Scotch Night</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    {logInLink}
                </li>
            </ul>
        </div>
    </header>);
});