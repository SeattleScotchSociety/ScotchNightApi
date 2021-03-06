import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { IRootStore } from '../stores/RootStore';
import { AddBottle } from './AddBottle';
import { GenericMap, IMarker } from './GenericMap';
import { Modal } from './Modal';
import { TastingMenu } from './TastingMenu';

import * as format from 'date-fns/format';

interface IEventDetailProps {
    store: IRootStore;
}
interface IEventDetailState {
    position: {
        lat: string;
        lng: string;
    };
}

@inject('store')
@observer
export class EventDetail extends React.Component<IEventDetailProps, IEventDetailState> {
    private add: AddBottle;

    constructor(props: IEventDetailProps) {
        super(props);

        this.buildEventMap = this.buildEventMap.bind(this);
        this.handleOnAddBottle = this.handleOnAddBottle.bind(this);
        this.clearCurrentEvent = this.clearCurrentEvent.bind(this);
    }

    private handleOnAddBottle() {
        this.add.open();
    }

    private buildEventMap(position: any) {
        let center = {
            lat: 47.6062095,
            lng: -122.3320708
        };

        if (position) {
            center = { ...position };
        }

        const markers = [
            {
                key: 'event-marker',
                position: center,
                animation: null
            }
        ];

        return (
            <GenericMap
                containerElement={<div className="map-container" />}
                mapElement={<div className="map" />}
                ref={() => null}
                defaultZoom={13}
                defaultCenter={center}
                markers={markers}
                onMapLoad={() => null}
                onMapClick={() => null}
            />
        );
    }

    private clearCurrentEvent() {
        const { scotchNightStore } = this.props.store;
        scotchNightStore.setCurrentEvent(null);
    }

    public render() {
        const { scotchNightStore } = this.props.store;
        const { currentEvent } = scotchNightStore;

        if (!currentEvent) {
            return null;
        }

        const { date, description, location, title } = currentEvent;
        const { address1, address2, city, state, zipCode, position } = location;
        const eventMap = this.buildEventMap(position);
        const fullAddress = `${address1}, ${address2 ? address2 + ', ' : ''}${city}, ${state} ${zipCode}`;

        return (
            <div className="container">
                <Link to="/events" onClick={this.clearCurrentEvent}>{`< Back to Events`}</Link>
                <h1 className="margin-top-md">{title}</h1>
                <p className="margin-vertical-md">
                    <em>{description}</em>
                </p>
                <p className="event__detail">
                    <i className="fa fa-fw fa-calendar-o" />&nbsp;{format(date, 'MMMM D, YYYY')}
                </p>
                <p className="event__detail">
                    <i className="fa fa-fw fa-clock-o" />&nbsp;{format(date, 'h:mm aa')}
                </p>
                <p className="event__detail">
                    <i className="fa fa-fw fa-map-marker" />&nbsp;{location.name}&nbsp;<a
                        className="text-sm"
                        href={`http://maps.apple.com/?daddr=${encodeURIComponent(fullAddress)}`}
                    >
                        (get directions)
                    </a>
                </p>
                {eventMap}
                <TastingMenu store={this.props.store} />
                <button className="btn btn--primary btn--block" onClick={this.handleOnAddBottle}>
                    Add Bottle
                </button>
                <AddBottle
                    ref={add => {
                        this.add = add;
                    }}
                    store={this.props.store}
                />
            </div>
        );
    }
}

export default EventDetail;
