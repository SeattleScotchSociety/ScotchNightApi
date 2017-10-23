import { inject, observer } from "mobx-react";
import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { BottleList } from "./components/BottleList";
import Callback from "./components/Callback";
import { ChooseUser } from "./components/ChooseUser";
import { EventList } from "./components/EventList";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { NavigationBar } from "./components/NavigationBar";
import { Auth } from "./services/Auth";
import { IRootStore } from "./stores/RootStore";

export interface IAppProps { store?: IRootStore; auth: Auth; }

interface IRouteProps extends RouteComponentProps<any>, React.Props<any>, IAppProps {
}

const handleAuthentication = (nextState, auth) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
};

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={(props) => (
            auth.isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
        )}
    />
);

const App = inject("store")(observer((props: IRouteProps) => {
    const { auth } = props;

    return (<div>
        <div id="site-head">
            <Header scotchNightStore={props.store.scotchNightStore} auth={auth} />
            <NavigationBar scotchNightStore={props.store.scotchNightStore} />
        </div>
        <main>
            <Switch>
                <Route
                    path="/login"
                    render={(p) => {
                        return <Login auth={auth} />;
                    }}
                />
                <PrivateRoute exact path="/bottles" component={BottleList} auth={auth} />
                <PrivateRoute exact path="/events" component={EventList} auth={auth} />
                <Route
                    path="/callback"
                    render={(p) => {
                        handleAuthentication(p, auth);
                        return <Callback />;
                    }}
                />
                <PrivateRoute path="/" component={ChooseUser} auth={auth} />
            </Switch>
        </main>
    </div>);
}));

export default withRouter(App) as React.ComponentClass<IAppProps>;
