import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from './Actions';
import DriversCss from './Drivers.scss';
import PositionUpdater from './PositionUpdater';

const DRAW_POSITIONS = 200;
const LEG_DRAW_WIDTH = 3;
const STOP_DRAW_SIZE = 6;
const STOP_DRAW_RADIUS = 4; // must be smaller than STOP_DRAW_SIZE
const STOP_FONT_SIZE = 8;
const DRIVER_SIZE = 10;

export class Drivers extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            a: 'b'
        };
    }

    componentDidMount = () => {
        this.props.actions.getData();
    }

    drawCanvas = ({ stops, legs, driver }) => {
        this.canvas.current.height = this.canvas.current.offsetWidth;
        this.canvas.current.width = this.canvas.current.offsetWidth;
        const resize = (coordinate) => {
            return (coordinate + 1) * this.canvas.current.height / (DRAW_POSITIONS + 2);
        };
        const stopMap = stops.reduce((acc, ele) => {
            acc[ele.name] = {
                x: ele.x,
                y: ele.y
            };
            return acc;
        }, {});
        const sortedLegs = legs.sort((leg1, leg2) => {
            return leg1.startStop < leg2.startStop ? -1 : 1;
        });
        const driverCoordinates = [resize(
            stopMap[driver.activeLegID.substring(0, 1)].x * (100 - driver.legProgress) / 100
            + stopMap[driver.activeLegID.substring(1)].x * driver.legProgress / 100
        ), resize(
            stopMap[driver.activeLegID.substring(0, 1)].y * (100 - driver.legProgress) / 100
            + stopMap[driver.activeLegID.substring(1)].y * driver.legProgress / 100
        )];

        const ctx = this.canvas.current.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.width);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = LEG_DRAW_WIDTH;
        ctx.strokeStyle = 'green';

        ctx.beginPath();
        ctx.moveTo(resize(stopMap.A.x), resize(stopMap.A.y));
        sortedLegs.forEach((leg) => {
            if (leg.legID === driver.activeLegID) {
                ctx.lineTo(...driverCoordinates);
                ctx.stroke();
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(...driverCoordinates);
                ctx.lineTo(resize(stopMap[leg.endStop].x), resize(stopMap[leg.endStop].y));
            } else {
                ctx.lineTo(resize(stopMap[leg.endStop].x), resize(stopMap[leg.endStop].y));
            }
        });
        ctx.stroke();

        ctx.lineWidth = STOP_DRAW_SIZE;
        ctx.font = `${STOP_FONT_SIZE}px`;
        stops.forEach((stop) => {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.arc(resize(stop.x), resize(stop.y), STOP_DRAW_RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fillText(stop.name,
                resize(stop.x) - STOP_FONT_SIZE / 2,
                resize(stop.y) + STOP_FONT_SIZE / 2 - 1);
        });

        ctx.fillStyle = 'green';
        ctx.fillRect(
            driverCoordinates[0] - DRIVER_SIZE / 2, driverCoordinates[1] - DRIVER_SIZE / 2,
            DRIVER_SIZE, DRIVER_SIZE
        );
    }

    render = () => {
        let legIDs = [];
        if (this.props.driverData.isFulfilled && this.canvas.current) {
            this.drawCanvas(this.props.driverData.data);
            legIDs = this.props.driverData.data.legs.map((leg) => {
                return leg.legID;
            });
        }
        return (
            <div>
                <h1 className={DriversCss.title}>Driver Status</h1>
                <PositionUpdater
                    retrigger={this.props.actions.getData}
                    superSetState={this.setState}
                    legIDs={legIDs}
                    driver={this.props.driverData.data.driver}
                    disabled={!this.props.driverData.data.driver.activeLegID}
                />
                <canvas className={DriversCss.canvas} ref={this.canvas} />
                {this.state.a}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        driverData: state.driverData
    };
};

const mapDispatchToProps = (dispatch) => {
    const actions = bindActionCreators(Actions, dispatch);
    return {
        actions
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Drivers);
